export interface TreeCategoryNode {
    id: number;
    label: string;
    children?: TreeCategoryNode[]; // 可選屬性，表示該節點是否有子節點
}

// 接口來表示整個樹的數據，可以定義一個更高層次的接口
export interface TreeCategoryData {
    data: TreeCategoryNode[]; // 根節點的數據
}
