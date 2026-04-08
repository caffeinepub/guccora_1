import type { Principal } from "@icp-sdk/core/principal";
export {
  OrderStatus,
  UserStatus,
  WithdrawStatus,
} from "../backend";
import type {
  AdminStats as BackendAdminStats,
  AuditLog as BackendAuditLog,
  BankDetails as BackendBankDetails,
  NotificationPublic as BackendNotificationPublic,
  OrderPublic as BackendOrderPublic,
  OrderStatus as BackendOrderStatus,
  PaymentDetails as BackendPaymentDetails,
  ProductPublic as BackendProductPublic,
  TreeNode as BackendTreeNode,
  UserPublic as BackendUserPublic,
  UserStatus as BackendUserStatus,
  WalletInfo as BackendWalletInfo,
  WithdrawRequestPublic as BackendWithdrawRequestPublic,
  WithdrawStatus as BackendWithdrawStatus,
} from "../backend";

export type UserId = Principal;
export type Timestamp = bigint;

// Re-export backend types as canonical frontend types
export type User = BackendUserPublic;
export type Product = BackendProductPublic;
export type Order = BackendOrderPublic;
export type WalletInfo = BackendWalletInfo;
export type WithdrawRequest = BackendWithdrawRequestPublic;
export type AdminStats = BackendAdminStats;
export type TreeNode = BackendTreeNode;
export type BankDetails = BackendBankDetails;
export type PaymentDetails = BackendPaymentDetails;
export type Notification = BackendNotificationPublic;
export type AuditLog = BackendAuditLog;

// Convenience type aliases for status enums
export type { BackendOrderStatus as OrderStatusType };
export type { BackendUserStatus as UserStatusType };
export type { BackendWithdrawStatus as WithdrawStatusType };

// Legacy Plan type (used by getPlans)
export interface Plan {
  id: bigint;
  name: string;
  price: bigint;
}

// Auth state stored in localStorage
export interface StoredAuth {
  userId: string | null;
  isAdmin: boolean;
}
