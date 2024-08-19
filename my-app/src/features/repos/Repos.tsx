import { useState } from "react"
import style from "./Repos.module.css"
import { useGetReposQuery } from "./reposApiSlice"
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import StarIcon from '@mui/icons-material/Star';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';

const orders = ['forks', 'stars', 'updated']

export const Repos = () => {
    const [request, setRequest] = useState("")
    const [numRows, setNumRows] = useState(10)
    const [page, setPage] = useState(0)
    const [input, setInput] = useState(request)
    const [sort, setSort] = useState({
        sortKey: 'best-match',
        isReverse: false,
    })
    const [description, setDescription] = useState({
        "id": -1,
        "name": 'empty',
        "topics": ['empty'],
        "language": 'empty',
        "stars": 0,
        "license": 'empty',
    })

    //Функция, отвечающая за сортировку, сбрасывает выбранный репозиторий и обнуляет страницу.
    //Если указать save false, то установит стандартный вид сортировки (используется при каждом новом поисковом запросе),
    //иначе следует указать sortKey который указывает на то по какому столбцу сортировать
    const handleSort = (sortKey:string, save:boolean) => {
        setDescription({
            "id": -1,
            "name": 'empty',
            "topics": ['empty'],
            "language": 'empty',
            "stars": 0,
            "license": 'empty',
        })
        setPage(0)
        const isReverse = sort.sortKey === sortKey && !sort.isReverse
        if (save) {
            setSort({sortKey, isReverse})
        } else {
            setSort({
                sortKey: 'best-match',
                isReverse: false,
            })
        }
        
    }
    
    const { data, isError, isLoading, isSuccess } = useGetReposQuery({request, numRows, page, sort})

    const options = [5, 10, 15, 20]

    //Функция, отвечающая за измение страниц, сбрасывает выбранный репозиторий и устанавливает нужную страницу
    const handleChangePage = (event:unknown, newPage:number) => {
        setDescription({
            "id": -1,
            "name": 'empty',
            "topics": ['empty'],
            "language": 'empty',
            "stars": 0,
            "license": 'empty',
        })
        setPage(newPage)
    }

    //Функция, отвечающая за изменение количества строк на странице, 
    //сбрасывает выбранный репозиторий, обнуляет страницы и устанавливает нужное количество строк
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription({
            "id": -1,
            "name": 'empty',
            "topics": ['empty'],
            "language": 'empty',
            "stars": 0,
            "license": 'empty',
        })
        setNumRows(parseInt(event.target.value, 10));
        setPage(0);
    };
    
    return (
        <div>
            <div className={style.header}>
            <input
                type="text"
                className={style.request_input} 
                id={"input"} 
                value={input}
                placeholder="Поисковой запрос" 
                onChange={e => {
                    setInput(String(e.target.value))
                }}
            ></input>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={!input}
                    className={style.search_button}
                    onClick={() => {
                    setRequest(String(document.querySelector("input")!.value))
                    handleSort('best-match', false)
                    setDescription({
                        "id": -1,
                        "name": 'empty',
                        "topics": ['empty'],
                        "language": 'empty',
                        "stars": 0,
                        "license": 'empty',
                    })
                    }}
                >
                    ИСКАТЬ
                </Button>
            </div>

            {
                request === ""
                ?
                <div className={style.info_div}>
                    <h1 className={style.info}>
                        Добро пожаловать
                    </h1>
                </div>
                :
                <div className={style.resuls_wrapper}>
                    <div className={style.search_results}>
                        Результаты поиска
                    </div>
                    {
                        isError
                        ?
                        <div className={style.info_div_small}>
                            <h1 className={style.info}>
                                Произошла ошибка😥
                            </h1>
                        </div>
                        :
                        isLoading
                        ?
                        <div className={style.info_div_small}>
                            <h1 className={style.info}>
                                Загрузка...
                            </h1>
                        </div>
                        :
                        isSuccess &&
                        <Paper sx={{ width: '970px', boxShadow: 'none'}}>
                            <TableContainer sx = {{ height: '436px', boxShadow: 'none', border: 'none'}} component={Paper}>
                                <Table stickyHeader sx={{ minWidth: 650 }}>
                                    <TableHead >
                                        <TableRow>
                                            <TableCell>Название</TableCell>
                                            <TableCell align="right">Язык</TableCell>
                                            <TableCell align="right">
                                                <TableSortLabel
                                                    active={orders.findIndex((x) => x === sort.sortKey) === 0 ? true : false}
                                                    direction={sort.isReverse ? 'asc' : 'desc'}
                                                    onClick={() => {
                                                        handleSort('forks', true)
                                                    }}
                                                    >
                                                    Число форков
                                                </TableSortLabel>
                                                
                                            </TableCell>
                                            <TableCell align="right">
                                                <TableSortLabel
                                                    active={orders.findIndex((x) => x === sort.sortKey) === 1 ? true : false}
                                                    direction={sort.isReverse ? 'asc' : 'desc'}
                                                    onClick={() => {
                                                        handleSort('stars', true)
                                                    }}
                                                    >
                                                    Число звёзд
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell align="right">
                                                <TableSortLabel
                                                    active={orders.findIndex((x) => x === sort.sortKey) === 2 ? true : false}
                                                    direction={sort.isReverse ? 'asc' : 'desc'}
                                                    onClick={() => {
                                                        handleSort('updated', true)
                                                    }}
                                                    >
                                                    Дата обновления
                                                </TableSortLabel>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {Array.from(data!.items).map(({ id, name, updated_at, stargazers_count, language, forks_count, license, topics }) => (
                                        <TableRow
                                        className={style.repo}
                                        key={id}
                                        onClick={() => {
                                            setDescription({
                                                "id": id,
                                                "name": name,
                                                "topics": topics,
                                                "language": language,
                                                "stars": stargazers_count,
                                                "license": license ? license.name : "нет лицензии",
                                            })
                                        }}>
                                        <TableCell component="th" scope="row">
                                            {name}
                                        </TableCell>
                                        <TableCell align="right">{language ? language : "нет языка"}</TableCell>
                                        <TableCell align="right">{forks_count}</TableCell>
                                        <TableCell align="right">{stargazers_count}</TableCell>
                                        <TableCell align="right">{updated_at.slice(0, 10).replaceAll('-', '.').split('.').reverse().join('.')}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={options}
                                component="div"
                                count={data!.total_count}
                                rowsPerPage={numRows}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                        
                    }
                    

                    <div className={style.sidebar}>
                        {description.id === -1 
                        ?
                        request !== "" && !isLoading &&
                        <div className={style.sidebar_text}>
                            Выберите репозиторий
                        </div> 
                        :
                        <div>
                            <div className={style.sidebar_name}>
                                {description.name}
                            </div>
                            <div className={style.sidebar_language}>
                                <Chip color="primary" label={(description.language ? description.language : "нет языка")}/>
                                <div className={style.sidebar_stars}>
                                    {<StarIcon sx={{ color: '#FFB400' }}></StarIcon>} {description.stars} 
                                </div>
                                
                            </div>
                            <div className={style.sidebar_topics}>
                                {description.topics.map((topic) => (
                                    <Chip label={topic} key={topic}/>
                                ))} 
                            </div>
                            <div className={style.sidebar_license}>
                                {description.license }
                            </div>
                            
                        </div>}
                    </div>
                </div>
            }
        <footer className={style.footer}></footer>
        </div>
    )

}