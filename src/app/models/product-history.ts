export class ProductHistory {
  id: string = '';
  productId: string = '';
  type: 'IN' | 'OUT' = 'OUT'; // Movement type (e.g., stock entry or removal)
  quantity: number = 0; // Amount moved
  timestamp: Date = new Date();
  user?: string = ''; // User who made the change
}