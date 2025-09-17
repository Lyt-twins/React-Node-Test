import { useState } from 'react'

const Card = ({ todo, onToggle, onRemove, pageNum }) => {

  let { id, name, status } = todo
  let isActive = status ? 'todoItem active' : 'todoItem'

  // 중복 클릭 방지를 위한 상태
  const [isProcessing, setIsProcessing] = useState(false)

  const handleToggle = () => {
    if (isProcessing) return
    setIsProcessing(true)
    
    // onToggle이 Promise를 반환하는 경우 처리
    const result = onToggle(todo)
    if (result && typeof result.then === 'function') {
      result.finally(() => setIsProcessing(false))
    } else {
      setTimeout(() => setIsProcessing(false), 500) // 0.5초 후 재활성화
    }
  }

  const handleRemove = () => {
    if (isProcessing) return
    setIsProcessing(true)
    
    const result = onRemove(id)
    if (result && typeof result.then === 'function') {
      result.finally(() => setIsProcessing(false))
    } else {
      setTimeout(() => setIsProcessing(false), 500) // 0.5초 후 재활성화
    }
  }

  return (
    <li className={isActive} data-page={pageNum}>
      <div className="item">
        <input 
          type="checkbox" 
          id={pageNum ? `${id}-page${pageNum}` : id} 
          checked={status}
          disabled={isProcessing}
          onChange={handleToggle} 
        />
        <label htmlFor={pageNum ? `${id}-page${pageNum}` : id}></label>
        <span>{name}</span>
      </div>
      <div className="item">
        <button 
          className='btn' 
          disabled={isProcessing}
          onClick={handleRemove}
        >
          삭제
        </button>
      </div>
    </li>
  )
}

export default Card