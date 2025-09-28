export const dummyData = {
  balance: {
    current: 4836.0,
    income: 3814.25,
    expenses: 1700.5,
  },
  transactions: [
    {
      avatar: "./assets/images/avatars/emma-richardson.jpg",
      name: "Emma Richardson",
      category: "General",
      date: "2024-08-19T14:23:11Z",
      amount: 75.5,
      recurring: false,
    },
    {
      avatar: "./assets/images/avatars/savory-bites-bistro.jpg",
      name: "Savory Bites Bistro",
      category: "Dining Out",
      date: "2024-08-19T20:23:11Z",
      amount: -55.5,
      recurring: false,
    },
    {
      avatar: "./assets/images/avatars/daniel-carter.jpg",
      name: "Daniel Carter",
      category: "General",
      date: "2024-08-18T09:45:32Z",
      amount: -42.3,
      recurring: false,
    },
  ],
  budgets: [
    {
      category: "Entertainment",
      maximum: 50.0,
      theme: "#277C78",
    },
    {
      category: "Bills",
      maximum: 750.0,
      theme: "#82C9D7",
    },
    {
      category: "Dining Out",
      maximum: 75.0,
      theme: "#F2CDAC",
    },
  ],
  pots: [
    {
      name: "Savings",
      target: 2000.0,
      total: 159.0,
      theme: "#277C78",
    },
    {
      name: "Concert Ticket",
      target: 150.0,
      total: 110.0,
      theme: "#626070",
    },
    {
      name: "Gift",
      target: 150.0,
      total: 110.0,
      theme: "#82C9D7",
    },
    {
      name: "New Laptop",
      target: 1000.0,
      total: 10.0,
      theme: "#F2CDAC",
    },
  ],
};
