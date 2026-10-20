export interface CategoryNode { id: string; name: string; parentId?: string | null }

export interface CategorySelectNode {
  value: string
  title: string
  label: string
  children: CategorySelectNode[]
}

export function buildCategorySelectTree(categories: readonly CategoryNode[]): CategorySelectNode[] {
  const visited = new Set<string>()
  const buildNode = (category: CategoryNode): CategorySelectNode[] => {
    if (visited.has(category.id)) return []
    visited.add(category.id)
    return [{
      value: category.id,
      title: category.name,
      label: getCategoryPath(categories, category.id),
      children: categories.filter((child) => child.parentId === category.id).flatMap(buildNode),
    }]
  }
  const roots = categories.filter((category) => !category.parentId || !categories.some((parent) => parent.id === category.parentId)).flatMap(buildNode)
  for (const category of categories) roots.push(...buildNode(category))
  return roots
}

export function getCategoryDepth(categories: readonly CategoryNode[], id: string): number {
  const seen = new Set<string>()
  let current = categories.find((category) => category.id === id)
  let depth = 0
  while (current && !seen.has(current.id)) {
    seen.add(current.id)
    depth++
    current = categories.find((category) => category.id === current!.parentId)
  }
  return depth
}

export function getCategoryPath(categories: readonly CategoryNode[], id: string): string {
  const names: string[] = []
  const seen = new Set<string>()
  let current = categories.find((category) => category.id === id)
  while (current && !seen.has(current.id)) {
    seen.add(current.id)
    names.unshift(current.name)
    current = categories.find((category) => category.id === current!.parentId)
  }
  return names.join('/')
}

export function getCategoryDescendantIds(categories: readonly CategoryNode[], id: string): Set<string> {
  const ids = new Set<string>()
  const pending = [id]
  while (pending.length) {
    const current = pending.pop()!
    if (ids.has(current)) continue
    ids.add(current)
    for (const category of categories) {
      if (category.parentId === current) pending.push(category.id)
    }
  }
  return ids
}
