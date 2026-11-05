import { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';

function QuestionModal({ show, question, onHide, onSave }) {
  const [content, setContent] = useState('');
  const [options, setOptions] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      setContent(question?.content ?? '');
      setOptions(question ? question.options.join(', ') : '');
      setCorrectAnswer(question?.correctAnswer ?? '');
      setError('');
    }
  }, [show, question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const list = options
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);

    if (!content.trim()) return setError('Nội dung câu hỏi không được để trống.');
    if (list.length < 2)
      return setError('Cần ít nhất 2 đáp án, cách nhau bằng dấu phẩy.');
    if (!correctAnswer.trim())
      return setError('Đáp án đúng không được để trống.');
    if (!list.includes(correctAnswer.trim()))
      return setError('Đáp án đúng phải nằm trong danh sách các đáp án.');

    onSave({
      content: content.trim(),
      options: list,
      correctAnswer: correctAnswer.trim(),
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>{question ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3" controlId="q-content">
            <Form.Label>Nội dung câu hỏi</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="q-options">
            <Form.Label>Các đáp án (cách nhau bằng dấu phẩy)</Form.Label>
            <Form.Control
              type="text"
              placeholder="VD: Queue, Stack, Array, Tree"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="q-correct">
            <Form.Label>Đáp án đúng</Form.Label>
            <Form.Control
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Hủy
          </Button>
          <Button type="submit" variant="primary">
            Lưu
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default QuestionModal;
