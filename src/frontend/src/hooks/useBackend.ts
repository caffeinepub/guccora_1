import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { createActor } from "../backend";
import { db } from "../lib/firebase";
import type {
  AdminStats,
  AuditLog,
  BankDetails,
  Notification,
  Order,
  PaymentDetails,
  Product,
  TreeNode,
  User,
  UserId,
  UserStatus,
  WalletInfo,
  WithdrawRequest,
} from "../types";
import { useAuth } from "./useAuth";

function useBackendActor() {
  return useActor(createActor);
}

// ─── Auth Mutations (Firestore-based) ────────────────────────────────────────

export function useLoginUser() {
  return useMutation({
    mutationFn: async ({
      mobile,
      password,
    }: {
      mobile: string;
      password: string;
    }) => {
      // Admin hardcoded credentials
      if (mobile === "6305462887" && password === "guccora@8433") {
        return { userId: mobile, role: "admin" as const };
      }

      // First try direct document lookup by mobile (document ID = mobile number)
      const userDocRef = doc(db, "users", mobile);
      const directSnapshot = await getDoc(userDocRef);

      if (directSnapshot.exists()) {
        const userData = directSnapshot.data();
        if (userData.password !== password) {
          throw new Error("Invalid mobile or password");
        }

        // Auto-populate any missing required fields
        const missingFields: Record<string, unknown> = {};
        if (!userData.wallet) {
          missingFields.wallet = { direct: 0, level: 0, pair: 0, total: 0 };
        }
        if (!userData.role) {
          missingFields.role = "user";
        }
        if (!userData.status) {
          missingFields.status = "active";
        }
        if (Object.keys(missingFields).length > 0) {
          await updateDoc(userDocRef, missingFields);
        }

        return {
          userId: mobile,
          role: (userData.role ?? "user") as "user" | "admin",
        };
      }

      // Fallback: query by mobile field (for documents created with addDoc / random ID)
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("mobile", "==", mobile));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error("Invalid mobile or password");
      }

      const fallbackDoc = snapshot.docs[0];
      const userData = fallbackDoc.data();

      if (userData.password !== password) {
        throw new Error("Invalid mobile or password");
      }

      // Auto-populate any missing required fields
      const missingFields: Record<string, unknown> = {};
      if (!userData.wallet) {
        missingFields.wallet = { direct: 0, level: 0, pair: 0, total: 0 };
      }
      if (!userData.role) {
        missingFields.role = "user";
      }
      if (!userData.status) {
        missingFields.status = "active";
      }
      if (Object.keys(missingFields).length > 0) {
        await updateDoc(fallbackDoc.ref, missingFields);
      }

      return {
        userId: mobile,
        role: (userData.role ?? "user") as "user" | "admin",
      };
    },
  });
}

export function useRegisterUser() {
  return useMutation({
    mutationFn: async ({
      name,
      mobile,
      password,
      referralCode,
      position,
    }: {
      name: string;
      mobile: string;
      password: string;
      referralCode: string | null;
      position?: "left" | "right";
    }) => {
      // Check if mobile already exists — direct doc lookup (O(1), avoids query)
      const userDocRef = doc(db, "users", mobile);
      const existingDoc = await getDoc(userDocRef);
      if (existingDoc.exists()) {
        throw new Error("User already exists");
      }

      // Fallback check via query for any legacy documents with random IDs
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("mobile", "==", mobile));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        throw new Error("User already exists");
      }

      // Save user to Firestore with mobile as the document ID
      const newUser = {
        name,
        mobile,
        password,
        role: "user",
        createdAt: new Date().toISOString(),
        referralCode: referralCode ?? "",
        position: position ?? "left",
        sponsorId: referralCode ?? "",
        wallet: { direct: 0, level: 0, pair: 0, total: 0 },
        status: "active",
      };

      // setDoc with mobile as document ID ensures consistent lookups
      await setDoc(userDocRef, newUser);

      // Return a User-compatible object
      return {
        id: mobile,
        name,
        mobile,
        role: "user",
        createdAt: newUser.createdAt,
        referralCode: referralCode ?? "",
        position: position ?? "left",
        sponsorId: referralCode ?? "",
        wallet: { direct: 0n, level: 0n, pair: 0n, total: 0n },
        status: { __kind__: "active" },
      } as unknown as User;
    },
  });
}

export function useAdminLogin() {
  return useMutation({
    mutationFn: async ({
      adminId,
      password,
    }: {
      adminId: string;
      password: string;
    }) => {
      // Hardcoded admin credentials
      if (adminId === "6305462887" && password === "guccora@8433") {
        return { adminId, role: "admin" as const };
      }
      throw new Error("Invalid admin credentials");
    },
  });
}

// ─── User Profile Queries ────────────────────────────────────────────────────

export function useMyProfile() {
  const { userId } = useAuth();
  return useQuery<User | null>({
    queryKey: ["myProfile", userId],
    queryFn: async () => {
      if (!userId) return null;
      // Fetch directly from Firestore — document ID is the mobile number
      const userDocRef = doc(db, "users", userId);
      const snapshot = await getDoc(userDocRef);
      if (!snapshot.exists()) return null;
      const data = snapshot.data();
      // Map Firestore fields to the User shape used across the app
      return {
        id: userId,
        name: data.name ?? "",
        mobile: data.mobile ?? userId,
        role: data.role ?? "user",
        createdAt: data.createdAt ?? "",
        referralCode: data.referralCode ?? "",
        position: data.position ?? "left",
        sponsorId: data.sponsorId ?? "",
        wallet: data.wallet
          ? {
              direct: BigInt(Math.round((data.wallet.direct ?? 0) * 100)),
              level: BigInt(Math.round((data.wallet.level ?? 0) * 100)),
              pair: BigInt(Math.round((data.wallet.pair ?? 0) * 100)),
              total: BigInt(Math.round((data.wallet.total ?? 0) * 100)),
            }
          : { direct: 0n, level: 0n, pair: 0n, total: 0n },
        status: { __kind__: data.status ?? "active" },
        // Convenience flag: profile is complete if the document exists
        isProfileComplete: true,
      } as unknown as User;
    },
    enabled: !!userId,
  });
}

export function useMyWallet() {
  const { actor, isFetching } = useBackendActor();
  const { userId } = useAuth();
  return useQuery<WalletInfo | null>({
    queryKey: ["myWallet", userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      const result = await actor.getMyWallet(userId);
      if (result.__kind__ === "ok") return result.ok as WalletInfo;
      return null;
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useMyReferralCode() {
  const { actor, isFetching } = useBackendActor();
  const { userId } = useAuth();
  return useQuery<string>({
    queryKey: ["myReferralCode", userId],
    queryFn: async () => {
      if (!actor || !userId) return "";
      return actor.getMyReferralCode(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useDownlineTree() {
  const { actor, isFetching } = useBackendActor();
  const { userId } = useAuth();
  return useQuery<TreeNode | null>({
    queryKey: ["downlineTree", userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      const result = await actor.getDownlineTree(userId);
      if (result.__kind__ === "ok") return result.ok as TreeNode;
      return null;
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useDirectDownline() {
  const { actor, isFetching } = useBackendActor();
  const { userId } = useAuth();
  return useQuery<User[]>({
    queryKey: ["directDownline", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getDirectDownline(userId) as Promise<User[]>;
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

// ─── Products ────────────────────────────────────────────────────────────────

export function useGetProducts() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts() as Promise<Product[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminGetProducts() {
  const { actor, isFetching } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  return useQuery<Product[]>({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      if (!actor || !adminId || !adminPassword) return [];
      const result = await actor.adminGetProducts(adminId, adminPassword);
      if (result.__kind__ === "ok") return result.ok as Product[];
      return [];
    },
    enabled: !!actor && !isFetching && !!adminId,
  });
}

export function useAdminAddProduct() {
  const { actor } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      price,
      imageUrl,
    }: {
      name: string;
      price: bigint;
      imageUrl: string | null;
    }) => {
      if (!actor || !adminId || !adminPassword)
        throw new Error("Not connected");
      const result = await actor.adminAddProduct(
        adminId,
        adminPassword,
        name,
        price,
        imageUrl,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useAdminUpdateProduct() {
  const { actor } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      price,
      imageUrl,
    }: {
      id: bigint;
      name: string;
      price: bigint;
      imageUrl: string | null;
    }) => {
      if (!actor || !adminId || !adminPassword)
        throw new Error("Not connected");
      const result = await actor.adminUpdateProduct(
        adminId,
        adminPassword,
        id,
        name,
        price,
        imageUrl,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useAdminDeleteProduct() {
  const { actor } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !adminId || !adminPassword)
        throw new Error("Not connected");
      const result = await actor.adminDeleteProduct(adminId, adminPassword, id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export function useMyOrders() {
  const { actor, isFetching } = useBackendActor();
  const { userId } = useAuth();
  return useQuery<Order[]>({
    queryKey: ["myOrders", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getMyOrders(userId) as Promise<Order[]>;
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function usePurchasePlan() {
  const { actor } = useBackendActor();
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      deliveryAddress,
      utrScreenshotUrl,
    }: {
      productId: bigint;
      deliveryAddress: string;
      utrScreenshotUrl: string | null;
    }) => {
      if (!actor || !userId) throw new Error("Not connected");
      const result = await actor.purchasePlan(
        userId,
        productId,
        deliveryAddress,
        utrScreenshotUrl,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["myWallet"] });
    },
  });
}

export function useAdminPendingOrders() {
  const { actor, isFetching } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  return useQuery<Order[]>({
    queryKey: ["adminPendingOrders"],
    queryFn: async () => {
      if (!actor || !adminId || !adminPassword) return [];
      const result = await actor.adminGetPendingOrders(adminId, adminPassword);
      if (result.__kind__ === "ok") return result.ok as Order[];
      return [];
    },
    enabled: !!actor && !isFetching && !!adminId,
  });
}

export function useAdminApproveOrder() {
  const { actor } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor || !adminId || !adminPassword)
        throw new Error("Not connected");
      const result = await actor.adminApproveOrder(
        adminId,
        adminPassword,
        orderId,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPendingOrders"] });
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

export function useAdminRejectOrder() {
  const { actor } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      reason,
    }: {
      orderId: bigint;
      reason: string;
    }) => {
      if (!actor || !adminId || !adminPassword)
        throw new Error("Not connected");
      const result = await actor.adminRejectOrder(
        adminId,
        adminPassword,
        orderId,
        reason,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPendingOrders"] });
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    },
  });
}

// ─── Notifications ───────────────────────────────────────────────────────────

export function useMyNotifications() {
  const { actor, isFetching } = useBackendActor();
  const { userId } = useAuth();
  return useQuery<Notification[]>({
    queryKey: ["myNotifications", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getMyNotifications(userId) as Promise<Notification[]>;
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useMarkNotificationRead() {
  const { actor } = useBackendActor();
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !userId) throw new Error("Not connected");
      const result = await actor.markNotificationRead(userId, id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myNotifications"] });
    },
  });
}

export function useAdminSendNotification() {
  const { actor } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      recipientId,
      message,
    }: {
      recipientId: UserId | null;
      message: string;
    }) => {
      if (!actor || !adminId || !adminPassword)
        throw new Error("Not connected");
      const result = await actor.adminSendNotification(
        adminId,
        adminPassword,
        recipientId,
        message,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotificationHistory"] });
    },
  });
}

export function useAdminNotificationHistory() {
  const { actor, isFetching } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  return useQuery<Notification[]>({
    queryKey: ["adminNotificationHistory"],
    queryFn: async () => {
      if (!actor || !adminId || !adminPassword) return [];
      const result = await actor.adminGetNotificationHistory(
        adminId,
        adminPassword,
      );
      if (result.__kind__ === "ok") return result.ok as Notification[];
      return [];
    },
    enabled: !!actor && !isFetching && !!adminId,
  });
}

// ─── Payment Details ─────────────────────────────────────────────────────────

export function useGetMyPaymentDetails() {
  const { actor, isFetching } = useBackendActor();
  const { userId } = useAuth();
  return useQuery<PaymentDetails | null>({
    queryKey: ["myPaymentDetails", userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      const result = await actor.getMyPaymentDetails(userId);
      if (result.__kind__ === "ok") return result.ok as PaymentDetails;
      return null;
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useSavePaymentDetails() {
  const { actor } = useBackendActor();
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bankDetails,
      upiId,
    }: {
      bankDetails: BankDetails | null;
      upiId: string | null;
    }) => {
      if (!actor || !userId) throw new Error("Not connected");
      const result = await actor.savePaymentDetails(userId, bankDetails, upiId);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPaymentDetails"] });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

// ─── Withdrawals ─────────────────────────────────────────────────────────────

export function useMyWithdrawals() {
  const { actor, isFetching } = useBackendActor();
  const { userId } = useAuth();
  return useQuery<WithdrawRequest[]>({
    queryKey: ["myWithdrawals", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getMyWithdrawals(userId) as Promise<WithdrawRequest[]>;
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useRequestWithdrawal() {
  const { actor } = useBackendActor();
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor || !userId) throw new Error("Not connected");
      const result = await actor.requestWithdrawal(userId, amount);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok as WithdrawRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myWithdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["myWallet"] });
    },
  });
}

// ─── Admin Queries ───────────────────────────────────────────────────────────

export function useAdminStats() {
  const { actor, isFetching } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  return useQuery<AdminStats | null>({
    queryKey: ["adminStats"],
    queryFn: async () => {
      if (!actor || !adminId || !adminPassword) return null;
      const result = await actor.adminGetStats(adminId, adminPassword);
      if (result.__kind__ === "ok") return result.ok as AdminStats;
      return null;
    },
    enabled: !!actor && !isFetching && !!adminId,
  });
}

export function useAdminUsers() {
  const { actor, isFetching } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  return useQuery<User[]>({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      if (!actor || !adminId || !adminPassword) return [];
      const result = await actor.adminGetAllUsers(adminId, adminPassword);
      if (result.__kind__ === "ok") return result.ok as User[];
      return [];
    },
    enabled: !!actor && !isFetching && !!adminId,
  });
}

export function useAdminOrders() {
  const { actor, isFetching } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  return useQuery<Order[]>({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      if (!actor || !adminId || !adminPassword) return [];
      const result = await actor.adminGetAllOrders(adminId, adminPassword);
      if (result.__kind__ === "ok") return result.ok as Order[];
      return [];
    },
    enabled: !!actor && !isFetching && !!adminId,
  });
}

export function useAdminWithdrawals() {
  const { actor, isFetching } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  return useQuery<WithdrawRequest[]>({
    queryKey: ["adminWithdrawals"],
    queryFn: async () => {
      if (!actor || !adminId || !adminPassword) return [];
      const result = await actor.adminGetAllWithdrawals(adminId, adminPassword);
      if (result.__kind__ === "ok") return result.ok as WithdrawRequest[];
      return [];
    },
    enabled: !!actor && !isFetching && !!adminId,
  });
}

export function useAdminAuditLog() {
  const { actor, isFetching } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  return useQuery<AuditLog[]>({
    queryKey: ["adminAuditLog"],
    queryFn: async () => {
      if (!actor || !adminId || !adminPassword) return [];
      const result = await actor.adminGetAuditLog(adminId, adminPassword);
      if (result.__kind__ === "ok") return result.ok as AuditLog[];
      return [];
    },
    enabled: !!actor && !isFetching && !!adminId,
  });
}

// ─── Admin User Control ──────────────────────────────────────────────────────

export function useSetUserStatus() {
  const { actor } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      status,
    }: {
      userId: UserId;
      status: UserStatus;
    }) => {
      if (!actor || !adminId || !adminPassword)
        throw new Error("Not connected");
      const result = await actor.setUserStatus(
        adminId,
        adminPassword,
        userId,
        status,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });
}

export function useResetUserPassword() {
  const { actor } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  return useMutation({
    mutationFn: async ({
      userId,
      newPassword,
    }: {
      userId: UserId;
      newPassword: string;
    }) => {
      if (!actor || !adminId || !adminPassword)
        throw new Error("Not connected");
      const result = await actor.resetUserPassword(
        adminId,
        adminPassword,
        userId,
        newPassword,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
  });
}

// ─── Admin Approval (Withdrawals) ────────────────────────────────────────────

export function useApproveWithdrawal() {
  const { actor } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor || !adminId || !adminPassword)
        throw new Error("Not connected");
      const result = await actor.adminApproveWithdrawal(
        adminId,
        adminPassword,
        requestId,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWithdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

export function useRejectWithdrawal() {
  const { actor } = useBackendActor();
  const { adminId, adminPassword } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor || !adminId || !adminPassword)
        throw new Error("Not connected");
      const result = await actor.adminRejectWithdrawal(
        adminId,
        adminPassword,
        requestId,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWithdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}
