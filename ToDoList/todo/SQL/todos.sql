-- Active: 1750388006843@@127.0.0.1@3306@aloha
DROP TABLE IF EXISTS `todos`;

CREATE TABLE `todos` (
	`no`	BIGINT	NOT NULL AUTO_INCREMENT PRIMARY KEY	COMMENT 'PK',
	`id`	VARCHAR(64)	NOT NULL	COMMENT 'UK',
	`name`	TEXT	NOT NULL	COMMENT '할일',
	`status`	BOOLEAN	NOT NULL	DEFAULT false	COMMENT '상태',
	`seq`	INT	NOT NULL	DEFAULT 0	COMMENT '순서',
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT current_timestamp	
													COMMENT '등록일자',
	`updated_at`	TIMESTAMP	NOT NULL	DEFAULT current_timestamp 
													ON UPDATE CURRENT_TIMESTAMP	
													COMMENT '수정일자'
);