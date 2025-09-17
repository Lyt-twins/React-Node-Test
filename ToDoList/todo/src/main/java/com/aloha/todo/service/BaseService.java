package com.aloha.todo.service;

import java.util.List;

import com.github.pagehelper.PageInfo;

public interface BaseService<E> {
    public List<E> list();
    public PageInfo<E> list(int page, int size);
    public E select(Long no);
    public E selectById(String id);
    public boolean insert(E entity);
    public boolean update(E entity);
    public boolean updateById(E entity);
    public boolean delete(Long no);
    public boolean deleteById(String id);
}
