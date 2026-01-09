import { getUsers } from "@/services/auth-api";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import React, { useEffect, useState } from "react";

// Define the User interface based on your API response
interface User {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  role: "ADMIN" | "AMIR" | "AMIRA" | "USER";
  gender: "MALE" | "FEMALE";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  telegramUserId?: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Helper to get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Helper for role badge colors
  const getRoleStyle = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 ring-purple-700/10";
      case "AMIR":
        return "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-blue-700/10";
      case "AMIRA":
        return "bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 ring-pink-700/10";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 ring-slate-500/10";
    }
  };

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark font-display">
      {/* --- Header --- */}
      <header className="px-8 pt-8 pb-6 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex flex-wrap justify-between items-end gap-4 max-w-7xl mx-auto">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight uppercase">
              Users
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Total {users.length} registered members
            </p>
          </div>
          <button className="group flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-primary text-black text-sm font-black tracking-widest uppercase transition-transform active:scale-95 hover:bg-[#3bf55a] shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-xl">
              person_add
            </span>
            <span>Add New User</span>
          </button>
        </div>
      </header>

      {/* --- Filters & Table Container --- */}
      <div className="px-8 pb-12 max-w-7xl mx-auto w-full flex flex-col h-full overflow-hidden">
        {/* Filter Bar */}
        <div className="bg-white dark:bg-[#152a19] p-4 rounded-t-3xl border-t border-x border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-60">
            <Search className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-primary focus:border-primary dark:text-white transition-all outline-none"
              placeholder="Search by name, phone or role..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold py-3 px-4 text-slate-600 dark:text-slate-300 outline-none">
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>
            <button className="flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 dark:bg-transparent dark:border-slate-700 dark:text-slate-400 dark:hover:text-white transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg">
                filter_list
              </span>
              Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#152a19] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col flex-1 rounded-b-3xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 sticky top-0">
                <tr>
                  <th className="px-6 py-5">Identities</th>
                  <th className="px-6 py-5">Role</th>
                  <th className="px-6 py-5">Phone & Contact</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`size-11 rounded-2xl flex items-center justify-center font-black text-xs border shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                            user.gender === "FEMALE"
                              ? "bg-pink-100 text-pink-600 border-pink-200"
                              : "bg-primary/10 text-primary border-primary/20"
                          }`}
                        >
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            {user.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {user.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-900 dark:text-white font-bold">
                          {user.phone}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {user.email || `TG: ${user.telegramUserId}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          user.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            user.isActive
                              ? "bg-green-600 dark:bg-green-400 animate-pulse"
                              : "bg-slate-400"
                          }`}
                        ></span>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <span className="material-symbols-outlined text-lg">
                            edit
                          </span>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <span className="material-symbols-outlined text-lg">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && (
              <div className="p-20 text-center">
                <div className="inline-block size-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Fetching Database...
                </p>
              </div>
            )}
          </div>

          {/* Footer Pagination */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#152a19] mt-auto">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Showing{" "}
              <span className="text-slate-900 dark:text-white">
                {users.length}
              </span>{" "}
              of{" "}
              <span className="text-slate-900 dark:text-white">
                {users.length}
              </span>{" "}
              users
            </p>
            <div className="flex items-center gap-2">
              <button
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30"
                disabled
              >
                <ChevronLeft className="material-symbols-outlined text-sm" />
              </button>
              <button className="px-4 py-1.5 bg-primary text-black font-black rounded-xl text-xs uppercase tracking-widest">
                1
              </button>
              <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
                <ChevronRight className="material-symbols-outlined text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Users;
