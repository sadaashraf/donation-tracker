export const revenueData = [
  { month: "JAN", value: 28000 },
  { month: "FEB", value: 34000 },
  { month: "MAR", value: 30000 },
  { month: "APR", value: 38000 },
  { month: "MAY", value: 42000 },
  { month: "JUN", value: 10000 },
];

export const upcomingPayments = [
  { id: 1, name: "Alex Johnson", plan: "Premium Plan", due: "Due in 2 days", amount: "$120.00" },
  { id: 2, name: "Sarah Williams", plan: "Basic Plan", due: "Due in 5 days", amount: "$45.00" },
  { id: 3, name: "Michael Chen", plan: "Pro Plan", due: "Due in 1 week", amount: "$89.00" },
];

export const paymentHistory = [
  { id: 1, year: "2025", name: "Alex Thompson",   amount: "$120.00", date: "2025-01-10", status: "Verified",  proof: "https://placehold.co/600x400?text=Receipt+1" },
  { id: 2, year: "2024", name: "Sarah Jenkins",   amount: "$115.00", date: "2024-03-22", status: "Verified",  proof: "https://placehold.co/600x400?text=Receipt+2" },
  { id: 3, year: "2025", name: "Marcus Miller",   amount: "$120.00", date: "2025-02-14", status: "Pending",   proof: "https://placehold.co/600x400?text=Receipt+3" },
  { id: 4, year: "2024", name: "Elena Rodriguez", amount: "$115.00", date: "2024-11-05", status: "Rejected",  proof: null },
  { id: 5, year: "2025", name: "James Kowalski",  amount: "$120.00", date: "2025-03-01", status: "Pending",   proof: "https://placehold.co/600x400?text=Receipt+5" },
  { id: 6, year: "2024", name: "Priya Sharma",    amount: "$115.00", date: "2024-07-18", status: "Verified",  proof: "https://placehold.co/600x400?text=Receipt+6" },
];

export const membersData = [
  { id: 1, name: "Christopher Lee", plan: "Premium Plan", status: "Active", initials: "CL", color: "bg-green-500" },
  { id: 2, name: "Sarah Williams", plan: "Basic Plan", status: "Pending", initials: "SW", color: "bg-blue-400" },
  { id: 3, name: "Marcus Anthony", plan: "Pro Plan", status: "Active", initials: "MA", color: "bg-purple-400" },
  { id: 4, name: "Elena Rodriguez", plan: "Basic Plan", status: "Expired", initials: "ER", color: "bg-orange-400" },
  { id: 5, name: "James Kowalski", plan: "Premium Plan", status: "Active", initials: "JK", color: "bg-teal-500" },
  { id: 6, name: "Priya Sharma", plan: "Pro Plan", status: "Pending", initials: "PS", color: "bg-pink-400" },
];

export const plans = [
  { id: 1, name: "Basic Plan", price: "$9/mo", features: ["Up to 50 members", "Email support", "Basic reports"], current: false },
  { id: 2, name: "Pro Plan", price: "$29/mo", features: ["Up to 500 members", "Priority support", "Advanced reports"], current: true },
  { id: 3, name: "Premium Plan", price: "$79/mo", features: ["Unlimited members", "24/7 support", "Custom reports"], current: false },
];