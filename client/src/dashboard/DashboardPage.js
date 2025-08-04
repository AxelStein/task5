import Table from 'react-bootstrap/Table';
import apiClient from '../api/api.client.js';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { BsChevronUp, BsChevronDown, BsFillHandThumbsUpFill, BsShuffle } from "react-icons/bs";
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import handleApiError from '../api/error.handler.js';
import Alert from 'react-bootstrap/Alert';

function DashboardPage() {
    const [data, setData] = useState();
    const [books, setBooks] = useState([]);
    const [isInitFetch, setInitFetch] = useState(false);
    const [expandedRow, setExpandedRow] = useState(-1);
    const [page, setPage] = useState(1);
    const [fetchErr, setFetchErr] = useState();
    const configRef = useRef(null);

    const handleError = (err) => {
        setFetchErr(handleApiError(err).message);
    }

    const fetchConfig = useCallback(() => {
        setFetchErr(undefined);

        apiClient.get('/books/config')
            .then(res => {
                const config = res.data;
                configRef.current = config;

                let l = config.supportedLocales.find(l => l.default === true);
                if (!l) {
                    l = config.supportedLocales[0];
                }

                setData({
                    locale: l.locale,
                    seed: config.seed.min,
                    likes: config.likes.min,
                    reviews: config.reviews.min
                });
            })
            .catch(err => handleError(err));
    }, []);

    const fetchBooks = useCallback(async (signal) => {
        if (!configRef.current) {
            fetchConfig();
        }

        if (!data) {
            return;
        }

        setInitFetch(page === 1);
        setFetchErr(undefined);

        apiClient.get(
            '/books/list',
            {
                params: { ...data, page },
                signal
            }
        ).then(res => {
            setInitFetch(false);
            setBooks(prev => [...prev, ...res.data]);
        }).catch(err => {
            handleError(err);
            if (!axios.isCancel(err)) {
                setInitFetch(false);
            }
        });
    }, [data, page, fetchConfig]);

    useEffect(() => {
        const controller = new AbortController();
        fetchBooks(controller.signal);
        return () => controller.abort();
    }, [fetchBooks]);

    const fetchNextPage = () => {
        if (!isInitFetch) {
            setPage(page + 1);
        }
    };

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    }

    const randomSeed = () => {
        const config = configRef.current;
        if (config) {
            onSeedChange({ target: { value: getRandomInt(config.seed.min, config.seed.max) } });
        }
    }

    const onBookClick = (book) => {
        setExpandedRow(expandedRow === book.index ? -1 : book.index);
    };

    const renderTableBody = (books) => {
        return (
            <tbody>
                {books.map(element => renderTableRow(element))}
            </tbody>
        );
    };

    const renderReviews = (book) => {
        const noReviews = book.reviews.length === 0;
        return (
            <div>
                {noReviews ?
                    (<p className='text-muted'>No reviews yet</p>) :
                    book.reviews.map((review, index) => {
                        return (
                            <div className='vstack' key={index} style={{ marginBottom: "10px" }}>
                                <div>{review.comment}</div>
                                <div className='text-muted fst-italic' style={{ fontSize: "14px" }}>
                                    — {review.author}, <span>{moment(review.date).format('ll')}</span>
                                </div>
                            </div>

                        );
                    })}
            </div>
        );
    }

    const renderTableRow = (book) => {
        const isSelected = book.index === expandedRow;
        const publisherFormatted = `${book.publisher}, ${moment(book.date).format('YYYY')}`;
        return (
            <Fragment key={book.index}>
                <tr key={book.index} onClick={() => onBookClick(book)} className={isSelected ? 'table-primary' : ''}>
                    <td>{isSelected ? <BsChevronUp /> : <BsChevronDown />}</td>
                    <td className='fw-bold'>{book.index + 1}</td>
                    <td>{book.isbn}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{publisherFormatted}</td>
                </tr>
                {isSelected && (
                    <tr>
                        <td colSpan={6}>
                            <div className='hstack my-2 align-items-start'>
                                <div>
                                    <div className='vstack mx-4'>
                                        <img src={book.cover} alt={book.title} width={100} height={150} />
                                        <span className='bg-like mt-2 text-center align-self-center'>
                                            <BsFillHandThumbsUpFill color='#fff' /> {book.likes} likes
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className='hstack align-items-baseline'>
                                        <h4>{book.title}</h4>
                                        <h6 className='text-muted ms-2'>{book.format}</h6>
                                    </div>

                                    <h6>by {book.author}</h6>
                                    <h6 className='text-muted'>{publisherFormatted}</h6>

                                    <h4 className='mt-4'>Reviews</h4>
                                    {renderReviews(book)}
                                </div>
                            </div>
                        </td>
                    </tr>
                )}
            </Fragment>
        );
    }

    const resetPage = () => {
        setPage(1);
        setBooks([]);
    };

    const setDataFieldFromEvent = (fieldName, event) => {
        const value = event.target.value;
        if (!value || value.length === 0) {
            return;
        }
        const o = { ...data };
        o[fieldName] = value;
        resetPage();
        setData(o);
        return true;
    }

    const onLocalChange = (event) => {
        setDataFieldFromEvent('locale', event);
    };

    const onSeedChange = (event) => {
        setDataFieldFromEvent('seed', event);
    };

    const onLikesChange = (event) => {
        setDataFieldFromEvent('likes', event);
    };

    const onReviewsChange = (event) => {
        setDataFieldFromEvent('reviews', event);
    };

    const localeDropDown = () => {
        const config = configRef.current;
        if (!config) {
            return null;
        }
        return (
            <>
                <Form.Text muted>Locale</Form.Text>
                <Form.Select value={data.locale} onChange={onLocalChange}>
                    {config.supportedLocales.map(v => (
                        <option key={v.locale} value={v.locale}>{v.name}</option>
                    ))}
                </Form.Select>
            </>
        );
    };

    const seedInput = () => {
        const config = configRef.current;
        if (!config) {
            return null;
        }
        return (
            <>
                <Form.Text muted>Seed</Form.Text>
                <Form.Control
                    type="number"
                    id="seedInput"
                    min={config.seed.min}
                    onChange={onSeedChange}
                    step={config.seed.step}
                    value={data.seed}
                />
            </>
        );
    };

    const likesRange = () => {
        const config = configRef.current;
        if (!config) {
            return null;
        }
        return (
            <>
                <Form.Text muted>Likes</Form.Text>
                <Form.Control
                    type="number"
                    id="likesInput"
                    step={config.likes.step}
                    min={config.likes.min}
                    max={config.likes.max}
                    onChange={onLikesChange}
                    value={data.likes}
                />
            </>
        );
    };

    const reviewsInput = () => {
        const config = configRef.current;
        if (!config) {
            return null;
        }
        return (
            <>
                <Form.Text muted>Reviews</Form.Text>
                <Form.Control
                    type="number"
                    id="reviewsInput"
                    step={config.reviews.step}
                    min={config.reviews.min}
                    max={config.reviews.max}
                    onChange={onReviewsChange}
                    value={data.reviews}
                />
            </>
        );
    };

    const loader = () => {
        return (<div className='spinner' />);
    }

    const errorContainer = (err) => {
        return (<Alert variant='danger' className='m-4'>{err}</Alert>);
    }

    const renderContent = () => {
        if (fetchErr) {
            return errorContainer(fetchErr);
        } else {
            return (
                <div id="scrollContainer" className='flex-grow' style={{ height: 'calc(100vh - 72px)', overflow: 'auto' }}>
                    <InfiniteScroll
                        hasMore={true}
                        dataLength={books.length}
                        loader={loader()}
                        next={fetchNextPage}
                        scrollableTarget="scrollContainer"
                    >
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>#</th>
                                    <th>ISBN</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Publisher</th>
                                </tr>
                            </thead>
                            {renderTableBody(books)}
                        </Table>
                    </InfiniteScroll>
                </div>
            );
        }
    }

    return (
        <div className="flex flex-col">
            <div className='sticky-top bg-white shadow-sm row d-flex row' style={{ padding: "0px 15px", height: "72px" }}>
                <div className='col'>{localeDropDown()}</div>
                <div className='ms-2 col'>{seedInput()}</div>
                <Button variant="outline-secondary" onClick={randomSeed} disabled={!configRef.current} className='btn-random-seed'>
                    <BsShuffle className='align-self-center' />
                </Button>
                <div className='ms-2 col'>{likesRange()}</div>
                <div className='ms-2 col'>{reviewsInput()}</div>
            </div>

            {renderContent()}
        </div>
    );
}

export default DashboardPage;