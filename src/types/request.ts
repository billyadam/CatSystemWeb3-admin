export type RequestStatus = 'pending' | 'approved' | 'rejected';

export type Request = {
  id: number;
  user_wallet: string;
  user_name: string | null;
  requested_at: string;
  status: RequestStatus;
  approved_by: string | null;
  approved_by_name: string | null;
  approved_at: string | null;
  rejected_by: string | null;
  rejected_by_name: string | null;
  rejected_at: string | null;
};
 