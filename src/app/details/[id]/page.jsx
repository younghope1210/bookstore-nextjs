"use client"
import React, { useEffect, useState } from 'react'
import { BsFillCartFill } from 'react-icons/bs'
import Image from 'next/image'
import ReviewModal from '@/componets/reviewModal/ReviewModal'
import classes from './details.module.css'
import ReviewCard from '@/componets/reviewCard/ReviewCard'
import { useDispatch } from 'react-redux'
import { addBook } from '@/app/redux/cartSlice'

const Details = (ctx) => {
    const id = ctx.params.id
    const URL = `https://openlibrary.org/works/${id}.json`
    const dispatch = useDispatch()
    const [book, setBook] = useState({})
    const [reviews, setReviews] = useState([])
    const [showModal, setShowModal] = useState(false)
    // five dollars per 100 pages
    const price = ((book?.pages / 100) * 5).toFixed(2)

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(URL)
                const data = await res.json()
                console.log(data)

                // if book has no pages specified, make them 350 by default
                let pages = null
                if (data?.excerpts) {
                    pages = data?.excerpts[0]?.pages
                } else {
                    pages = 350
                }



                const details = {
                    title: data.title,
                    // desc: data.description.value,
                    id: data.key.split('/')[2],
                    cover_image: `https://covers.openlibrary.org/b/id/${data?.covers[0]}-L.jpg`,
                    pages
                }

                setBook(details)
            } catch (error) {
                console.log(error)
            }
        }
        fetchDetails()
    }, [])

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`https://localhost:3000/api/review?bookId=${id}`)
                const data = await res.json()

                setReviews(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchReviews()
    }, [book])

    const handleShowModal = () => setShowModal(true)
    const handleHideModal = () => setShowModal(false)

    const handleAddToCart = () => {
        dispatch(addBook({
            ...book,
            quantity: 1,
            price
        }))
    }

    console.log(book)

    return (
        <div className={classes.container}>
            <div className={classes.wrapper}>
                <div className={classes.bookDetails}>
                    <div className={classes.left}>
                        <Image
                            src={book?.cover_image}
                            height="750"
                            width="350"
                            alt="Book cover"
                        />
                    </div>
                    <div className={classes.right}>
                        <h1 className={classes.title}>
                            {book?.title}
                        </h1>
                        <p className={classes.desc}>
                            {/* {book?.desc?.slice(0, 750)} */}
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </p>
                        <div className={classes.section}>
                            <span className={classes.price}>
                                Price: ${price}
                            </span>
                            <span className={classes.book_pages}>
                                Pages: {book?.pages}
                            </span>
                        </div>
                        <div className={classes.section}>
                            <button onClick={handleAddToCart} className={classes.cart}>
                                Add to Cart
                                <BsFillCartFill />
                            </button>
                            <button onClick={handleShowModal} className={classes.reviewButton}>
                                Review Book
                            </button>
                        </div>
                        {showModal && (
                            <ReviewModal
                                handleHideModal={handleHideModal}
                                bookId={book?.id}
                            />
                        )}
                    </div>
                </div>
                <div className={classes.reviews}>
                    {reviews?.map((review) => (
                        <ReviewCard
                            key={review._id}
                            review={review}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Details