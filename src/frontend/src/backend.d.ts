import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Plan {
    id: bigint;
    name: string;
    price: bigint;
}
export type Timestamp = bigint;
export interface AuditLog {
    id: bigint;
    action: string;
    timestamp: Timestamp;
    details: string;
    targetUserId?: UserId;
}
export interface UserPublic {
    id: UserId;
    status: UserStatus;
    referralCode: string;
    directIncome: bigint;
    hasBankDetails: boolean;
    hasUpiId: boolean;
    rightChild?: UserId;
    name: string;
    createdAt: Timestamp;
    sponsorId?: UserId;
    totalIncome: bigint;
    levelIncome: bigint;
    leftChild?: UserId;
    mobileNumber: string;
    isAdmin: boolean;
    position: string;
    pairIncome: bigint;
    walletBalance: bigint;
}
export interface ProductPublic {
    id: bigint;
    name: string;
    isActive: boolean;
    imageUrl?: string;
    price: bigint;
}
export interface TreeNode {
    name: string;
    user: UserId;
    children: Array<TreeNode>;
}
export interface OrderPublic {
    id: bigint;
    status: OrderStatus;
    deliveryAddress: string;
    planId: bigint;
    rejectionReason?: string;
    planPrice: bigint;
    timestamp: Timestamp;
    buyer: UserId;
    utrScreenshotUrl?: string;
}
export interface WithdrawRequestPublic {
    id: bigint;
    status: WithdrawStatus;
    user: UserId;
    processedAt?: Timestamp;
    amount: bigint;
    requestedAt: Timestamp;
}
export interface BankDetails {
    ifsc: string;
    accountHolderName: string;
    accountNumber: string;
}
export type UserId = string;
export interface AdminStats {
    totalOrders: bigint;
    pendingWithdrawals: bigint;
    pendingOrders: bigint;
    totalCommissionsPaid: bigint;
    totalUsers: bigint;
    totalRevenue: bigint;
    netProfit: bigint;
}
export interface WalletInfo {
    directIncome: bigint;
    balance: bigint;
    totalIncome: bigint;
    levelIncome: bigint;
    pairIncome: bigint;
}
export interface PaymentDetails {
    bankDetails?: BankDetails;
    upiId?: string;
}
export interface NotificationPublic {
    id: bigint;
    isRead: boolean;
    message: string;
    timestamp: Timestamp;
    recipientId?: UserId;
}
export enum OrderStatus {
    pendingApproval = "pendingApproval",
    approved = "approved",
    rejected = "rejected"
}
export enum UserStatus {
    active = "active",
    hold = "hold",
    inactive = "inactive"
}
export enum WithdrawStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    adminAddProduct(adminId: string, password: string, name: string, price: bigint, imageUrl: string | null): Promise<{
        __kind__: "ok";
        ok: ProductPublic;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminApproveOrder(adminId: string, password: string, orderId: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminApproveWithdrawal(adminId: string, password: string, requestId: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminDeleteProduct(adminId: string, password: string, id: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetAllOrders(adminId: string, password: string): Promise<{
        __kind__: "ok";
        ok: Array<OrderPublic>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetAllUsers(adminId: string, password: string): Promise<{
        __kind__: "ok";
        ok: Array<UserPublic>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetAllWithdrawals(adminId: string, password: string): Promise<{
        __kind__: "ok";
        ok: Array<WithdrawRequestPublic>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetAuditLog(adminId: string, password: string): Promise<{
        __kind__: "ok";
        ok: Array<AuditLog>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetNotificationHistory(adminId: string, password: string): Promise<{
        __kind__: "ok";
        ok: Array<NotificationPublic>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetPendingOrders(adminId: string, password: string): Promise<{
        __kind__: "ok";
        ok: Array<OrderPublic>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetProducts(adminId: string, password: string): Promise<{
        __kind__: "ok";
        ok: Array<ProductPublic>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetStats(adminId: string, password: string): Promise<{
        __kind__: "ok";
        ok: AdminStats;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminLogin(adminId: string, password: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminRejectOrder(adminId: string, password: string, orderId: bigint, reason: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminRejectWithdrawal(adminId: string, password: string, requestId: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSendNotification(adminId: string, password: string, recipientId: UserId | null, message: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminUpdateProduct(adminId: string, password: string, id: bigint, name: string, price: bigint, imageUrl: string | null): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getDirectDownline(userId: UserId): Promise<Array<UserPublic>>;
    getDownlineTree(userId: UserId): Promise<{
        __kind__: "ok";
        ok: TreeNode;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMyNotifications(userId: UserId): Promise<Array<NotificationPublic>>;
    getMyOrders(userId: UserId): Promise<Array<OrderPublic>>;
    getMyPaymentDetails(userId: UserId): Promise<{
        __kind__: "ok";
        ok: PaymentDetails;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMyProfile(userId: UserId): Promise<{
        __kind__: "ok";
        ok: UserPublic;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMyReferralCode(userId: UserId): Promise<string>;
    getMyWallet(userId: UserId): Promise<{
        __kind__: "ok";
        ok: WalletInfo;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMyWithdrawals(userId: UserId): Promise<Array<WithdrawRequestPublic>>;
    getPlans(): Promise<Array<Plan>>;
    getProducts(): Promise<Array<ProductPublic>>;
    getUserByMobile(mobileNumber: string): Promise<UserPublic | null>;
    loginUser(mobileNumber: string, password: string): Promise<{
        __kind__: "ok";
        ok: {
            userId: UserId;
            profile: UserPublic;
        };
    } | {
        __kind__: "err";
        err: string;
    }>;
    markNotificationRead(userId: UserId, notificationId: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    purchasePlan(userId: UserId, productId: bigint, deliveryAddress: string, utrScreenshotUrl: string | null): Promise<{
        __kind__: "ok";
        ok: OrderPublic;
    } | {
        __kind__: "err";
        err: string;
    }>;
    registerUser(name: string, mobileNumber: string, password: string, sponsorCode: string | null, position: string | null): Promise<{
        __kind__: "ok";
        ok: UserPublic;
    } | {
        __kind__: "err";
        err: string;
    }>;
    requestWithdrawal(userId: UserId, amount: bigint): Promise<{
        __kind__: "ok";
        ok: WithdrawRequestPublic;
    } | {
        __kind__: "err";
        err: string;
    }>;
    resetUserPassword(adminId: string, password: string, userId: UserId, newPassword: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    savePaymentDetails(userId: UserId, bankDetails: BankDetails | null, upiId: string | null): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setUserStatus(adminId: string, password: string, userId: UserId, status: UserStatus): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
