type NavLink = {
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  href: string;
};
type IconProps = { className?: string };

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };
type PotJSON = {
  id: string;
  ownerId: string;
  name: string;
  target: number;
  total: number;
  updatedAt: string;
  createdAt: string;
  themeId: {
    _id: string;
    key: string;
    name: string;
    value: string;
  };
};

type UserJSON = {
  id: string;
  username: string;
  email: string;
  balance: {
    current: number;
    income: number;
    expenses: number;
  };
};
type BudgetJSON = {
  categoryId: {
    _id: string;
    name: string;
    key: string;
  };
  id: string;
  maximum: number;
  ownerId: string;
  themeId: {
    _id: string;
    name: string;
    value: string;
  };
};
type getTransactionsReturn = {
  transactions: (ITransactionDoc & { categoryId: { name: string; themeId: string } })[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
};
