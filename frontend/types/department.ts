export interface Department {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  open_tickets_count?: number;
}
