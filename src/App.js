import { useEffect, useState, useRef, useCallback } from 'react';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);
  const loaderRef = useRef();

  const fetchImages = async (index) => {
      const url = `https://jsonplaceholder.typicode.com/photos?_page=${index}&_limit=9`;
      const res = await fetch(url);
      const data = await res.json();
      return data;
  }

  const fetchFirstPage = async () => {
    const data = await fetchImages(1);
    setImages(data);
  }

  useEffect(() => {
    fetchFirstPage();
  }, [])

  const getData = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const data = await fetchImages(page);
    setImages((prevImages) => [...prevImages, ...data]);
    setTimeout(() => {
      setLoading(false);
    }, 1000)
    setPage((prevPage) => prevPage + 1);
  }, [page, loading])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        //call next page data
        getData();
      }
    });
    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader)
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    }
  }, [getData]);

  return (
    <div className="App">
      <h1>Infinite Scrolling</h1>
      {
        images.map((image, index) => {
          return <img src={image.thumbnailUrl} alt={image.title} key={index} />
        })
      }
      <div ref={loaderRef}>
        {
          loading && <h2>...Loading</h2>
        }
      </div>
    </div>
  );
}

export default App;
