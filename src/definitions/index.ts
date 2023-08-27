export type Dict = {
  get: (key: number) => Promise<string | undefined | null>
  length: number
}

export type IndexDict = {
  get: (key: string) => Promise<number | undefined | null>
  length: number
}
