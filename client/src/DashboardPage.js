import Table from 'react-bootstrap/Table';
import apiClient from './api/api.client.js';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { BsChevronUp, BsChevronDown, BsFillHandThumbsUpFill } from "react-icons/bs";
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';

function DashboardPage() {
    const [locale, setLocale] = useState('ru_RU');
    const [seed, setSeed] = useState(4);
    const [likes, setLikes] = useState(0);
    const [reviews, setReviews] = useState(0);
    const [books, setBooks] = useState([]);
    const [isInitFetch, setInitFetch] = useState(false);
    const [expandedRow, setExpandedRow] = useState(-1);
    const [page, setPage] = useState(1);

    const fetchBooks = useCallback((signal) => {
        setInitFetch(page === 1);
        apiClient.get(
            '/books/list',
            {
                params: { locale, seed, likes, reviews, page },
                signal
            }
        ).then(res => {
            setInitFetch(false);
            setBooks(prev => [...prev, ...res.data]);
        }).catch(err => {
            console.log(err);
            if (!axios.isCancel(err)) {
                setInitFetch(false);
            }
        });
    }, [likes, locale, seed, reviews, page]);

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
                    book.reviews.map(review => {
                        return (
                            <div className='vstack' key={review.id} style={{ marginBottom: "10px" }}>
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

    const onLocalChange = (event) => {
        resetPage();
        setLocale(event.target.value);
    };

    const onSeedChange = (event) => {
        resetPage();
        setExpandedRow(-1);
        setSeed(event.target.value);
    };

    const onLikesChange = (event) => {
        resetPage();
        setLikes(event.target.value);
    };

    const onReviewsChange = (event) => {
        resetPage();
        setReviews(event.target.value);
    };

    const localeDropDown = () => {
        return (
            <>
                <Form.Text muted>Locale</Form.Text>
                <Form.Select value={locale} onChange={onLocalChange}>
                    <option value="en_US">English (US)</option>
                    <option value="ru_RU">Russian (RU)</option>
                    <option value="fr_FR">French (FR)</option>
                </Form.Select>
            </>
        );
    };

    const seedInput = () => {
        return (
            <>
                <Form.Text muted>Seed</Form.Text>
                <Form.Control
                    type="number"
                    id="seedInput"
                    min={0}
                    onChange={onSeedChange}
                    step="1"
                    value={seed}
                />
            </>
        );
    };

    const likesRange = () => {
        return (
            <>
                <Form.Text muted>Likes</Form.Text>
                <Form.Control
                    type="number"
                    id="likesInput"
                    step="0.1"
                    min={0}
                    max={10}
                    onChange={onLikesChange}
                    value={likes}
                />
            </>
        );
    };

    const reviewsInput = () => {
        return (
            <>
                <Form.Text muted>Reviews</Form.Text>
                <Form.Control
                    type="number"
                    id="reviewsInput"
                    step="0.1"
                    min={0}
                    max={10}
                    onChange={onReviewsChange}
                    value={reviews}
                />
            </>
        );
    };

    const loader = () => {
        return (<div className='spinner' />);
    }

    return (
        <div className="flex flex-col">
            <div className='sticky-top bg-white shadow-sm row d-flex row' style={{ padding: "0px 15px", height: "72px" }}>
                <div className='col'>{localeDropDown()}</div>
                <div className='ms-2 col'>{seedInput()}</div>
                <div className='ms-2 col'>{likesRange()}</div>
                <div className='ms-2 col'>{reviewsInput()}</div>
            </div>

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
        </div>
    );
}

export default DashboardPage;