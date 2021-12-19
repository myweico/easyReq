export const getCommentTemplate = (comment: CommentSchema) => {
  if (!comment || JSON.stringify(comment) === '{}') return '';

  return `
		/**
		 ${Object.entries(comment)
       .map(([key, value]) => {
         if (value === undefined || value === null || value === '') {
           return '';
         }
         // 换行的加上 *，以便可以格式化
         value = value.split('\n').filter(Boolean).join('\n * ');
         return `* ${key}: ${value}`;
       })
       .filter(Boolean)
       .join('\n')}
		 */`;
};