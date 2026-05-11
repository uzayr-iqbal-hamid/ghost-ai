export interface MockProject {
  id: string
  name: string
  slug: string
  ownership: "owned" | "shared"
}

export const MOCK_PROJECTS: MockProject[] = [
  {
    id: "p-order-service",
    name: "Order Service",
    slug: "order-service",
    ownership: "owned",
  },
  {
    id: "p-checkout-flow",
    name: "Checkout Flow",
    slug: "checkout-flow",
    ownership: "owned",
  },
  {
    id: "p-payments-platform",
    name: "Payments Platform",
    slug: "payments-platform",
    ownership: "shared",
  },
]
