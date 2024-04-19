"use client"
import React, { useEffect, useState } from 'react'
import classes from './bookCatalog.module.css'
import Pagination from '../pagination/Pagination'
import BookCard from '../bookCard/BookCard'



const BookCatalog = () => {

  const [title, setTitle] = useState("the lord of the rings");
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 3;

  const BASE_URL = `https://openlibrary.org/search.json?title=${title}`

  useEffect(() => {
    const getData = setTimeout(async () => {
      try {
        setIsLoading(true)
        const res = await fetch(BASE_URL); // book API 가져오기
        const { docs } = await res.json();

        let books = docs.slice(0, 50); // 50권의 책 새로운 배열로 가져오기

        books = books.map((book) => {
          const id = book.key.split("/")[2]; 

          return {
            id: id,
            title: book.title,
            cover_id: book.cover_i,
            author_name: book.author_name,
            public_rating: book.ratings_average,
            published_year: book.first_published_year
          }
        })

        // 책표지가 있는 책들만 추려내기
        const formattedBooks = []
        for (let i = 0; i < books.length; i++) {
          if (books[i]?.cover_id) {
            formattedBooks.push(books[i]);
          }
        }

        setBooks(formattedBooks)
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    })

    return () => {
      clearTimeout(getData);
    }
  }, [title])


  const endOffset = itemOffset + itemsPerPage; // 0 + 3
  const currentItems = books.slice(itemOffset, endOffset) // i ~ i+3 까지 새로운 배열로 가져온다


  return (
    <div>
      <div className={classes.container}>
        <div className={classes.wrapper}>
          <div className={classes.titles}>
            <h5> Catelog of books</h5>
            <h2>Find your desired books</h2>
          </div>
          {isLoading && (
            <div className={classes.loader}>

            </div>
          )}
          <div className={classes.books}>
            {!isLoading && (
              //display the items
              currentItems?.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                 
                />
              ))
            )}
          </div>
          {!isLoading && (
            <Pagination 
              setItemOffset={setItemOffset}
              itemsPerPage={itemsPerPage}
              books={books}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default BookCatalog
