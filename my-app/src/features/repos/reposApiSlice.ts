import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
//Интерфейс объекта содержащего информацию о том как надо сортировать данные
interface Sort {
    sortKey: string
    isReverse: boolean
}
//Интерфейс объекта содержащего всю информацию о запросе на сервер
interface Req {
    request: string
    numRows: number
    page: number
    sort: Sort
}
//Интерфейс объекта Лицензия, который возвращается с сервера
interface License {
    key: string
    name: string
    node_id: string
    spdx_id: string
    url: string
}
//Интерфейс объекта Репозиторий, который возвращается с сервера
interface Repo {
    id: number
    name: string
    description: string
    updated_at: string
    stargazers_count: number
    language: string
    forks_count: number
    license: License
    topics: Array<string>
}
//Интерфейс, отвечающий за данные возвращающиеся с сервера  
interface ReposApiResponse {
    incomplete_results: boolean
    items: Repo[]
    total_count: number
}
//Функция, создающая API, используется Github REST API
export const reposApiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "https://api.github.com/search/repositories" }),
    reducerPath: "reposApi",
    tagTypes: ["Repos"],
    endpoints: build => ({
        getRepos: build.query<ReposApiResponse, Req>({
            query: ({request, numRows, page, sort}) => `?q=${request}&per_page=${numRows}&page=${page + 1}&sort=${sort.sortKey}&order=${sort.isReverse ? 'asc' : 'desc'}`,
        }),
    }),
})

export const { useGetReposQuery } = reposApiSlice