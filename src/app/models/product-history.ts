export class ProductHistory {
    id: string = ''; 
    productId: string = ''; 
    type: 'IN' | 'OUT' = 'OUT'; // Movement type (e.g., stock entry or removal)
    quantity: number = 0; // Amount moved
    timestamp: Date = new(Date); 
    source?: string; // Optional, where it came from (e.g., supplier, warehouse)
    destination?: string; // Optional, where it’s going (e.g., customer, store)
    remarks?: string; // Any additional info
  }