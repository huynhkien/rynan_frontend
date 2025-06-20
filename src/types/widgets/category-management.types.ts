export type Order = 'asc' | 'desc';
export interface UpdateCategory{
    isUpdateCategory: number | null,
    setIsUpdateCategory: (isUpdateCategory: number | null) => void
}
