import React, { useEffect, useState } from 'react'
import Card from './Card'

const Page = ({ pageNum, initialData, initialPagination, onToggle, onRemove, getList, isInitialPage = false }) => {
  const [pageData, setPageData] = useState(initialData)
  const [pagination, setPagination] = useState(initialPagination)

  // initialData가 변경될 때 pageData 업데이트
  useEffect(() => {
    setPageData(initialData)
  }, [initialData])

  // initialPagination이 변경될 때 pagination 업데이트
  useEffect(() => {
    setPagination(initialPagination)
  }, [initialPagination])

  // 해당 페이지 데이터를 서버에서 다시 가져오기
  const refreshPage = () => {
    // 초기 페이지(pageNum === 0)는 getList를 통해 갱신
    if (isInitialPage && getList) {
      console.log('Refreshing initial page via getList');
      getList() // 전체 초기 데이터 새로고침
      return
    }

    // 일반 페이지는 해당 페이지만 갱신
    if (pageNum > 0) {
      fetch(`http://localhost:8080/todos?page=${pageNum}`)
        .then(response => response.json())
        .then(data => {
          console.log(`Page ${pageNum} refreshed:`, data);
          setPageData(data.list)
          setPagination(data.pagination)
        })
        .catch(error => {
          console.error(`Page ${pageNum} refresh error:`, error)
        })
    }
  }

  // 페이지 내 할일 토글 핸들러
  const handlePageToggle = (todo) => {
    // 초기 페이지는 전달받은 onToggle 사용
    if (isInitialPage && onToggle) {
      onToggle(todo)
      return
    }

    // 일반 페이지는 서버 요청 후 페이지 갱신
    fetch(`http://localhost:8080/todos`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...todo,
        status: !todo.status
      })
    })
    .then(response => {
      if (response.ok) {
        console.log(`Refreshing page ${pageNum} after toggle`)
        refreshPage()
      }
    })
    .catch(error => {
      console.error('Toggle error:', error)
    })
  }

  // 페이지 내 할일 삭제 핸들러
  const handlePageRemove = (id) => {
    // 초기 페이지는 전달받은 onRemove 사용
    if (isInitialPage && onRemove) {
      onRemove(id)
      return
    }

    // 일반 페이지는 서버 요청 후 페이지 갱신
    fetch(`http://localhost:8080/todos/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        console.log(`Refreshing page ${pageNum} after delete`)
        refreshPage()
      }
    })
    .catch(error => {
      console.error('Delete error:', error)
    })
  }

  return (
    <div className={`page-section ${isInitialPage ? 'initial-page' : ''}`} data-page={pageNum}>
      {/* 페이지 정보 표시 */}
        <div className="page-info">
          {!isInitialPage && (
            <>
              <span className="page-number">
                Page {pagination?.page || pageNum}
              </span>
              <span className="page-details">
                ({pagination?.start || 1}-{pagination?.end || pagination?.count || pageData.length} of {pagination?.total || '?'} items)
              </span>
            </>
          )}

          {pagination && !isInitialPage && (
            <span className="page-meta">
              Size: {pagination.size} | Index: {pagination.index}
            </span>
          )}
        </div>
      
      <ul className={pageNum === 0 ? 'initial-list' : 'new-list'}>
        {
          pageData.map((todo) => (
            <Card 
              key={todo.id}
              todo={todo} 
              onToggle={handlePageToggle}
              onRemove={handlePageRemove}
              pageNum={pageNum}
            />
          ))
        }
      </ul>
    </div>
  )
}

export default Page