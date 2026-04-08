import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
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
  WalletInfo,
  WithdrawRequest,
} from "../types";
import type { UserId } from "../types";
import type { UserStatus } from "../types";

function useBackendActor() {
  return useActor(createActor);
}

// ─── Auth Mutations ──────────────────────────────────────────────────────────

export function useLoginUser() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      mobile,
      password,
    }: {
      mobile: string;
      password: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.loginUser(mobile, password);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
  });
}

export function useRegisterUser() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      name,
      mobile,
      password,
      referralCode,
    }: {
      name: string;
      mobile: string;
      password: string;
      referralCode: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.registerUser(
        name,
        mobile,
        password,
        referralCode,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok as User;
    },
  });
}

export function useAdminLogin() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      adminId,
      password,
    }: {
      adminId: string;
      password: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminLogin(adminId, password);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
  });
}

// ─── User Profile Queries ────────────────────────────────────────────────────

export function useMyProfile() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<User | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getMyProfile();
      if (result.__kind__ === "ok") return result.ok as User;
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyWallet() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<WalletInfo | null>({
    queryKey: ["myWallet"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getMyWallet();
      if (result.__kind__ === "ok") return result.ok as WalletInfo;
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyReferralCode() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<string>({
    queryKey: ["myReferralCode"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getMyReferralCode();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDownlineTree() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<TreeNode | null>({
    queryKey: ["downlineTree"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getDownlineTree();
      if (result.__kind__ === "ok") return result.ok as TreeNode;
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDirectDownline() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<User[]>({
    queryKey: ["directDownline"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDirectDownline() as Promise<User[]>;
    },
    enabled: !!actor && !isFetching,
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
  return useQuery<Product[]>({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.adminGetProducts();
      if (result.__kind__ === "ok") return result.ok as Product[];
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminAddProduct() {
  const { actor } = useBackendActor();
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
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminAddProduct(name, price, imageUrl);
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
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminUpdateProduct(id, name, price, imageUrl);
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminDeleteProduct(id);
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
  return useQuery<Order[]>({
    queryKey: ["myOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders() as Promise<Order[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePurchasePlan() {
  const { actor } = useBackendActor();
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
      if (!actor) throw new Error("Not connected");
      const result = await actor.purchasePlan(
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
  return useQuery<Order[]>({
    queryKey: ["adminPendingOrders"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.adminGetPendingOrders();
      if (result.__kind__ === "ok") return result.ok as Order[];
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminApproveOrder() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminApproveOrder(orderId);
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      reason,
    }: {
      orderId: bigint;
      reason: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminRejectOrder(orderId, reason);
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
  return useQuery<Notification[]>({
    queryKey: ["myNotifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyNotifications() as Promise<Notification[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkNotificationRead() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.markNotificationRead(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myNotifications"] });
    },
  });
}

export function useAdminSendNotification() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      recipientId,
      message,
    }: {
      recipientId: UserId | null;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminSendNotification(recipientId, message);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotificationHistory"] });
    },
  });
}

export function useAdminNotificationHistory() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Notification[]>({
    queryKey: ["adminNotificationHistory"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.adminGetNotificationHistory();
      if (result.__kind__ === "ok") return result.ok as Notification[];
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Payment Details ─────────────────────────────────────────────────────────

export function useGetMyPaymentDetails() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<PaymentDetails | null>({
    queryKey: ["myPaymentDetails"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getMyPaymentDetails();
      if (result.__kind__ === "ok") return result.ok as PaymentDetails;
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSavePaymentDetails() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bankDetails,
      upiId,
    }: {
      bankDetails: BankDetails | null;
      upiId: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.savePaymentDetails(bankDetails, upiId);
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
  return useQuery<WithdrawRequest[]>({
    queryKey: ["myWithdrawals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyWithdrawals() as Promise<WithdrawRequest[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRequestWithdrawal() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.requestWithdrawal(amount);
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
  return useQuery<AdminStats | null>({
    queryKey: ["adminStats"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.adminGetStats();
      if (result.__kind__ === "ok") return result.ok as AdminStats;
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminUsers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<User[]>({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.adminGetAllUsers();
      if (result.__kind__ === "ok") return result.ok as User[];
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminOrders() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Order[]>({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.adminGetAllOrders();
      if (result.__kind__ === "ok") return result.ok as Order[];
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminWithdrawals() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<WithdrawRequest[]>({
    queryKey: ["adminWithdrawals"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.adminGetAllWithdrawals();
      if (result.__kind__ === "ok") return result.ok as WithdrawRequest[];
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminAuditLog() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<AuditLog[]>({
    queryKey: ["adminAuditLog"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.adminGetAuditLog();
      if (result.__kind__ === "ok") return result.ok as AuditLog[];
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Admin User Control ──────────────────────────────────────────────────────

export function useSetUserStatus() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      status,
    }: {
      userId: UserId;
      status: UserStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.setUserStatus(userId, status);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });
}

export function useResetUserPassword() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      userId,
      newPassword,
    }: {
      userId: UserId;
      newPassword: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.resetUserPassword(userId, newPassword);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
  });
}

// ─── Admin Approval (Withdrawals) ────────────────────────────────────────────

export function useApproveWithdrawal() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminApproveWithdrawal(requestId);
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.adminRejectWithdrawal(requestId);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWithdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}
