"use client";

import { useState } from "react";
import { ClipboardList, Clock, CheckCircle, XCircle, Wallet, RefreshCw } from "lucide-react";
import { useGetListRequest } from "@/hooks/useGetRequest";
import type { RequestStatus } from "@/types/request";

type FilterTab = "all" | RequestStatus;

const STATUS_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; icon: React.ReactNode; badge: string; dot: string }
> = {
  pending: {
    label: "Pending",
    icon: <Clock className="w-4 h-4" />,
    badge: "bg-amber-50 text-amber-600 border border-amber-200",
    dot: "bg-amber-400",
  },
  approved: {
    label: "Approved",
    icon: <CheckCircle className="w-4 h-4" />,
    badge: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    dot: "bg-emerald-400",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle className="w-4 h-4" />,
    badge: "bg-red-50 text-red-500 border border-red-200",
    dot: "bg-red-400",
  },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shortenWallet(wallet: string) {
  if (!wallet) return "—";
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("pending");
  const filterStatus = activeTab === "all" ? undefined : activeTab;

  const { data: requests, isLoading, isError, refetch, isFetching } = useGetListRequest(filterStatus);
  const { data: allRequests } = useGetListRequest(undefined);

  const counts = {
    pending: allRequests?.filter((r) => r.status === "pending").length ?? 0,
    approved: allRequests?.filter((r) => r.status === "approved").length ?? 0,
    rejected: allRequests?.filter((r) => r.status === "rejected").length ?? 0,
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] px-4 sm:px-6 py-6 md:py-10">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-blue-500" strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Requests</h1>
              <p className="text-sm text-gray-400">Daftar semua permintaan pengguna</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {(["pending", "approved", "rejected"] as RequestStatus[]).map((s) => {
            const cfg = STATUS_CONFIG[s];
            return (
              <div
                key={s}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-1"
              >
                <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wide">
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </div>
                <p className="text-2xl font-bold text-gray-900">{counts[s]}</p>
              </div>
            );
          })}
        </div>

        {/* ── Filter Tabs + Table ── */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">

          {/* Tabs */}
          <div className="flex gap-1 p-3 border-b border-gray-100 overflow-x-auto">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={[
                  "px-4 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
                  activeTab === tab.key
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center gap-3 text-gray-400">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="text-sm">Memuat data…</span>
            </div>
          ) : isError ? (
            <div className="py-20 flex flex-col items-center gap-3 text-red-400">
              <XCircle className="w-6 h-6" />
              <span className="text-sm">Gagal memuat data. Coba refresh.</span>
            </div>
          ) : !requests || requests.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3 text-gray-400">
              <ClipboardList className="w-6 h-6" />
              <span className="text-sm">Tidak ada request ditemukan.</span>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 font-medium uppercase tracking-wide border-b border-gray-100">
                      <th className="px-5 py-3">ID</th>
                      <th className="px-5 py-3">Wallet</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Requested At</th>
                      <th className="px-5 py-3">Processed By</th>
                      <th className="px-5 py-3">Processed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req, idx) => {
                      const cfg = STATUS_CONFIG[req.status];
                      const processedBy = req.approved_by || req.rejected_by || null;
                      const processedByName = req.approved_by_name || req.rejected_by_name || null;
                      const processedAt = req.approved_at || req.rejected_at || null;
                      return (
                        <tr
                          key={req.id}
                          className={[
                            "transition-colors hover:bg-gray-50/60",
                            idx !== requests.length - 1 ? "border-b border-gray-100" : "",
                          ].join(" ")}
                        >
                          <td className="px-5 py-3.5 font-mono text-gray-500 text-xs">#{req.id}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <Wallet className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <div>
                                {req.user_name && (
                                  <p className="text-sm font-medium text-gray-800 leading-tight">{req.user_name}</p>
                                )}
                                <p className="font-mono text-xs text-gray-400" title={req.user_wallet}>
                                  {shortenWallet(req.user_wallet)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${cfg.badge}`}
                            >
                              {cfg.icon}
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 text-xs">{formatDate(req.requested_at)}</td>
                          <td className="px-5 py-3.5">
                            {processedBy ? (
                              <div>
                                {processedByName && (
                                  <p className="text-sm font-medium text-gray-800 leading-tight">{processedByName}</p>
                                )}
                                <p className="font-mono text-xs text-gray-400" title={processedBy}>
                                  {shortenWallet(processedBy)}
                                </p>
                              </div>
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 text-xs">{formatDate(processedAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List */}
              <div className="md:hidden divide-y divide-gray-100">
                {requests.map((req) => {
                  const cfg = STATUS_CONFIG[req.status];
                  const processedBy = req.approved_by || req.rejected_by || null;
                  const processedByName = req.approved_by_name || req.rejected_by_name || null;
                  const processedAt = req.approved_at || req.rejected_at || null;
                  return (
                    <div key={req.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-gray-400">#{req.id}</span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${cfg.badge}`}
                        >
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wallet className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <div>
                          {req.user_name && (
                            <p className="text-sm font-medium text-gray-800 leading-tight">{req.user_name}</p>
                          )}
                          <p className="font-mono text-xs text-gray-400" title={req.user_wallet}>
                            {shortenWallet(req.user_wallet)}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        Requested: {formatDate(req.requested_at)}
                      </div>
                      {processedBy && (
                        <div className="text-xs text-gray-400">
                          Processed by:{" "}
                          <span className="font-medium text-gray-600">
                            {processedByName ?? shortenWallet(processedBy)}
                          </span>
                          {processedByName && (
                            <span className="font-mono ml-1 text-gray-400">({shortenWallet(processedBy)})</span>
                          )}
                          {processedAt && ` · ${formatDate(processedAt)}`}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="h-4 md:h-8" />
      </div>
    </div>
  );
}
