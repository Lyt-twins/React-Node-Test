import React from 'react'

const Input = ({ input, onChange, onSubmit }) => {
  return (
    <div>
      <form className="form" onSubmit={onSubmit}>
        <input type="text"
          placeholder='할 일 입력'
          className='input'
          value={input}
          onChange={onChange}
          />
        <button type='submit' className='btn'>
          추가
        </button>
      </form>
    </div>
  )
}

export default Input