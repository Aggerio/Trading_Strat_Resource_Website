from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database import Base


class Strategy(Base):
    __tablename__ = "strategies"

    id = Column(Integer, primary_key=True, index=True)
    paper_ref = Column(String(20))
    name = Column(String(200), nullable=False, index=True)
    asset_class = Column(String(50), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    strategy_type = Column(String(50))
    outlook = Column(String(100))
    difficulty = Column(String(20), default="intermediate")
    short_description = Column(Text)
    full_description = Column(Text)
    formulas = Column(JSON)
    max_profit = Column(String(200))
    max_loss = Column(String(200))
    breakeven = Column(String(400))
    legs = Column(JSON)
    related_strategies = Column(JSON)
    references = Column(JSON)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)

    lesson = relationship("Lesson", back_populates="strategies")
    progress = relationship("UserProgress", back_populates="strategy")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    module = Column(String(50), nullable=False, index=True)
    order = Column(Integer, nullable=False)
    title = Column(String(200), nullable=False)
    subtitle = Column(String(300))
    content = Column(Text)
    prerequisites = Column(JSON)
    difficulty = Column(String(20), default="beginner")

    strategies = relationship("Strategy", back_populates="lesson")
    quizzes = relationship("Quiz", back_populates="lesson")


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    title = Column(String(200), nullable=False)
    passing_score = Column(Float, default=0.7)

    lesson = relationship("Lesson", back_populates="quizzes")
    questions = relationship("QuizQuestion", back_populates="quiz")


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    question_type = Column(String(30), default="multiple_choice")
    question_text = Column(Text, nullable=False)
    options = Column(JSON)
    correct_answer = Column(String(500), nullable=False)
    explanation = Column(Text)
    order = Column(Integer, default=0)

    quiz = relationship("Quiz", back_populates="questions")


class GlossaryTerm(Base):
    __tablename__ = "glossary_terms"

    id = Column(Integer, primary_key=True, index=True)
    term = Column(String(200), nullable=False, index=True, unique=True)
    definition = Column(Text, nullable=False)
    category = Column(String(100))
    related_terms = Column(JSON)
    related_strategy_ids = Column(JSON)


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    strategy_id = Column(Integer, ForeignKey("strategies.id"), nullable=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=True)
    status = Column(String(20), default="not_started")
    score = Column(Float, nullable=True)
    attempts = Column(Integer, default=0)
    last_accessed = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    strategy = relationship("Strategy", back_populates="progress")
