import apiClient from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminStats {
    total_users: number;
    active_rides: number;
    completed_rides: number;
    pending_reports: number;
    open_disputes: number;
    cancellation_rate: number;
}

export interface User {
    id: string;
    phone: string;
    name: string;
    gender: string | null;
    avatar_url: string | null;
    rating_avg: number;
    completed_rides_count: number;
    is_verified: boolean;
    is_blocked: boolean;
    is_admin: boolean;
    is_onboarding_complete: boolean;
    created_at: string | null;
}

export interface UserListResponse {
    total: number;
    users: User[];
}

export interface Ride {
    id: string;
    host_id: string;
    host_name: string | null;
    pickup_area: string | null;
    destination_text: string;
    estimated_fare: number;
    final_fare: number | null;
    status: string;
    gender_preference: string;
    passenger_limit: number;
    created_at: string | null;
    expires_at: string | null;
    guest_count: number;
    cancelled_count: number;
}

export interface RideListResponse {
    total: number;
    rides: Ride[];
}

export interface Report {
    id: string;
    reporter_id: string;
    reporter_name: string | null;
    reported_user_id: string;
    reported_user_name: string | null;
    match_id: string | null;
    reason: string;
    description: string | null;
    status: string;
    created_at: string | null;
}

export interface ReportListResponse {
    total: number;
    reports: Report[];
}

export interface Dispute {
    id: string;
    ride_id: string;
    host_id: string;
    host_name: string | null;
    guest_id: string;
    guest_name: string | null;
    status: string;
    started_at: string | null;
    completed_at: string | null;
    created_at: string | null;
}

export interface DisputeListResponse {
    total: number;
    disputes: Dispute[];
}

export interface BlockUnblockResponse {
    user_id: string;
    is_blocked: boolean;
    message: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function adminLogin(phone: string, otp: string): Promise<{ access_token: string }> {
    const res = await apiClient.post('/auth/admin-login', { phone, otp });
    return res.data;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<AdminStats> {
    const res = await apiClient.get('/admin/stats');
    return res.data;
}

export async function getCancellationStats(days: number = 7) {
    const res = await apiClient.get('/admin/stats/cancellations', { params: { days } });
    return res.data;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function listUsers(params: {
    page?: number;
    per_page?: number;
    search?: string;
    is_blocked?: boolean;
}): Promise<UserListResponse> {
    const res = await apiClient.get('/admin/users', { params });
    return res.data;
}

export async function blockUser(userId: string): Promise<BlockUnblockResponse> {
    const res = await apiClient.patch(`/admin/users/${userId}/block`);
    return res.data;
}

export async function unblockUser(userId: string): Promise<BlockUnblockResponse> {
    const res = await apiClient.patch(`/admin/users/${userId}/unblock`);
    return res.data;
}

// ─── Rides ────────────────────────────────────────────────────────────────────

export async function listActiveRides(params: {
    page?: number;
    per_page?: number;
}): Promise<RideListResponse> {
    const res = await apiClient.get('/admin/rides/active', { params });
    return res.data;
}

export async function listCompletedRides(params: {
    page?: number;
    per_page?: number;
}): Promise<RideListResponse> {
    const res = await apiClient.get('/admin/rides/completed', { params });
    return res.data;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function listReports(params: {
    page?: number;
    per_page?: number;
    status?: string;
}): Promise<ReportListResponse> {
    const res = await apiClient.get('/admin/reports', { params });
    return res.data;
}

export async function updateReportStatus(reportId: string, status: string): Promise<Report> {
    const res = await apiClient.patch(`/admin/reports/${reportId}`, { status });
    return res.data;
}

// ─── Disputes ─────────────────────────────────────────────────────────────────

export async function listDisputes(params: {
    page?: number;
    per_page?: number;
}): Promise<DisputeListResponse> {
    const res = await apiClient.get('/admin/disputes', { params });
    return res.data;
}

export async function resolveDispute(disputeId: string, status: string, resolution_note?: string): Promise<Dispute> {
    const res = await apiClient.patch(`/admin/disputes/${disputeId}`, { status, resolution_note });
    return res.data;
}

// ─── Meetup Reports ───────────────────────────────────────────────────────────

export async function listMeetupReports(params: {
    page?: number;
    per_page?: number;
    status?: string;
}): Promise<ReportListResponse> {
    const res = await apiClient.get('/admin/meetup-reports', { params });
    return res.data;
}