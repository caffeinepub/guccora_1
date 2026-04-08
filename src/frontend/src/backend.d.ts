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
export type UserId = Principal;
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
    adminAddProduct(name: string, price: bigint, imageUrl: string | null): Promise<{
        __kind__: "ok";
        ok: ProductPublic;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminApproveOrder(orderId: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminApproveWithdrawal(requestId: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminDeleteProduct(id: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetAllOrders(): Promise<{
        __kind__: "ok";
        ok: Array<OrderPublic>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetAllUsers(): Promise<{
        __kind__: "ok";
        ok: Array<UserPublic>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetAllWithdrawals(): Promise<{
        __kind__: "ok";
        ok: Array<WithdrawRequestPublic>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetAuditLog(): Promise<{
        __kind__: "ok";
        ok: Array<AuditLog>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetNotificationHistory(): Promise<{
        __kind__: "ok";
        ok: Array<NotificationPublic>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetPendingOrders(): Promise<{
        __kind__: "ok";
        ok: Array<OrderPublic>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetProducts(): Promise<{
        __kind__: "ok";
        ok: Array<ProductPublic>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetStats(): Promise<{
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
    adminRejectOrder(orderId: bigint, reason: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminRejectWithdrawal(requestId: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSendNotification(recipientId: UserId | null, message: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminUpdateProduct(id: bigint, name: string, price: bigint, imageUrl: string | null): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getDirectDownline(): Promise<Array<UserPublic>>;
    getDownlineTree(): Promise<{
        __kind__: "ok";
        ok: TreeNode;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMyNotifications(): Promise<Array<NotificationPublic>>;
    getMyOrders(): Promise<Array<OrderPublic>>;
    getMyPaymentDetails(): Promise<{
        __kind__: "ok";
        ok: PaymentDetails;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMyProfile(): Promise<{
        __kind__: "ok";
        ok: UserPublic;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMyReferralCode(): Promise<string>;
    getMyWallet(): Promise<{
        __kind__: "ok";
        ok: WalletInfo;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMyWithdrawals(): Promise<Array<WithdrawRequestPublic>>;
    getPlans(): Promise<Array<Plan>>;
    getProducts(): Promise<Array<ProductPublic>>;
    getUserByMobile(mobileNumber: string): Promise<UserPublic | null>;
    /**
     * / Make the caller an admin if no admin exists yet.
     */
    initAdmin(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
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
    markNotificationRead(notificationId: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    purchasePlan(productId: bigint, deliveryAddress: string, utrScreenshotUrl: string | null): Promise<{
        __kind__: "ok";
        ok: OrderPublic;
    } | {
        __kind__: "err";
        err: string;
    }>;
    registerUser(name: string, mobileNumber: string, password: string, sponsorCode: string | null): Promise<{
        __kind__: "ok";
        ok: UserPublic;
    } | {
        __kind__: "err";
        err: string;
    }>;
    requestWithdrawal(amount: bigint): Promise<{
        __kind__: "ok";
        ok: WithdrawRequestPublic;
    } | {
        __kind__: "err";
        err: string;
    }>;
    resetUserPassword(userId: UserId, newPassword: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    savePaymentDetails(bankDetails: BankDetails | null, upiId: string | null): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setUserStatus(userId: UserId, status: UserStatus): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
