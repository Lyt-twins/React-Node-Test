import React, { useEffect, useState } from 'react'
import Card from './Card'
import Page from './Page'

const List = ({ todoList, onToggle, onRemove, getList, initialPagination }) => {

  // 🧊 페이지별 데이터 관리
  const [currentPage, setCurrentPage] = useState(1)
  const [pages, setPages] = useState([]) // [{ pageNum: 1, data: [...], pagination: {...} }]
  const [lastPage, setLastPage] = useState(initialPagination?.last || null)

  // 초기 데이터를 페이지로 설정
  useEffect(() => {
    if (todoList.length > 0 || (todoList.length === 0 && initialPagination)) {
      const initialPage = {
        pageNum: 0, // 초기 데이터는 pageNum을 0으로 설정
        data: todoList,
        pagination: initialPagination || {
          page: 1,
          size: todoList.length,
          total: todoList.length,
          count: todoList.length,
          start: todoList.length > 0 ? 1 : 0,
          end: todoList.length,
          first: 1,
          last: todoList.length > 0 ? 1 : 0
        }
      }
      
      console.log('Setting initial page:', initialPage);
      
      // 초기 페이지가 이미 있는지 확인
      setPages(prev => {
        const hasInitialPage = prev.some(page => page.pageNum === 0)
        if (hasInitialPage) {
          // 기존 초기 페이지 업데이트
          return prev.map(page => 
            page.pageNum === 0 ? initialPage : page
          )
        } else {
          // 새로운 초기 페이지 추가
          return [initialPage, ...prev]
        }
      })
    }
  }, [todoList, initialPagination])

  // 새 페이지 데이터 추가 함수
  const addPage = (pageNum) => {
    // 이미 해당 페이지가 있으면 스킵
    if (pages.some(page => page.pageNum === pageNum)) {
      return
    }

    fetch(`http://localhost:8080/todos?page=${pageNum}`)
      .then(response => response.json())
      .then(data => {
        console.log(`Loading page ${pageNum}:`, data);
        
        // 마지막 페이지 정보 저장
        setLastPage(data.pagination.last)
        
        // 마지막 페이지 체크
        if( pageNum > data.pagination.last ) {
          alert('마지막 페이지 입니다.')
          return
        }

        // 새 페이지 데이터 추가
        const newPage = {
          pageNum: pageNum,
          data: data.list,
          pagination: data.pagination
        }

        setPages(prev => [...prev, newPage])
        setCurrentPage(pageNum)
      })
      .catch( error => { console.error(error) })
  }

  // ✨ 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const todoListElement = document.querySelector('.todoList')
    const scrollHeight = todoListElement.scrollHeight
    const scrollTop = todoListElement.scrollTop
    const clientHeight = todoListElement.clientHeight

    // 스크롤 맨 마지막이고, 아직 더 페이지가 있다면
    if( clientHeight + scrollTop == scrollHeight ) {
      const nextPage = currentPage + 1
      if (lastPage === null || nextPage <= lastPage) {
        addPage(nextPage)
      }
    }
  }

  useEffect(() => {
    const todoListElement = document.querySelector('.todoList')
    if( todoListElement )
      todoListElement.addEventListener('scroll', handleScroll)
    
    return () => {
      if( todoListElement ) {
        todoListElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [currentPage, lastPage])
  
  return (
    <div className="todoList">
      {/* 모든 페이지를 Page 컴포넌트로 통합 렌더링 */}
      {pages.length > 0 ? (
        pages
          .sort((a, b) => a.pageNum - b.pageNum) // pageNum 0 (초기 데이터)이 맨 앞에 오도록
          .map(page => (
            <Page
              key={`page-${page.pageNum}`}
              pageNum={page.pageNum}
              initialData={page.data}
              initialPagination={page.pagination}
              getList={getList}
              onToggle={page.pageNum === 0 ? onToggle : undefined}  // 초기 데이터는 기존 핸들러 사용
              onRemove={page.pageNum === 0 ? onRemove : undefined}  // 초기 데이터는 기존 핸들러 사용
              isInitialPage={page.pageNum === 0}  // 초기 페이지 여부 전달
            />
          ))
      ) : (
        // 데이터가 없을 때 표시
        <div className="empty-state">
          <div className="empty-message">
            <h3>할 일이 없습니다</h3>
            <p>새로운 할 일을 추가해보세요!</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default List