import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

interface Topic {
  id: number;
  title: string;
  level: number;
  unlocked: boolean;
  questions: Question[];
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  topics: Topic[] = [
    { id: 1, title: 'Atividade 1', level: 1, unlocked: true, questions: [
      {
        id: 1,
        text: 'Qual é a capital da França?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'A'
      }
    ] },
    { id: 2, title: 'Atividade 2', level: 2, unlocked: false, questions: [
      {
        id: 1,
        text: 'Qual é a capital da Alemanha?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'B'
      }
    ] },
    { id: 3, title: 'Atividade 3', level: 3, unlocked: false, questions: [
      {
        id: 1,
        text: 'Qual é a capital da Itália?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'C'
      }
    ] },
    { id: 4, title: 'Atividade 4', level: 4, unlocked: false, questions: [
      {
        id: 1,
        text: 'Qual é a capital da Espanha?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'D'
      }
    ] },
    { id: 5, title: 'Atividade 5', level: 5, unlocked: false, questions: [
      {
        id: 1,
        text: 'Qual é a capital de Portugal?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'A'
      }
    ] },
    { id: 6, title: 'Atividade 6', level: 6, unlocked: false, questions: [
      {
        id: 1,
        text: 'Qual é a capital do Japão?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'B'
      }
    ] },
  ];

  additionalTopics: Topic[] = [
    { id: 7, title: 'Atividade 7', level: 7, unlocked: true, questions: [
      {
        id: 1,
        text: 'Qual é a capital do Canadá?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'A'
      }
    ] },
    { id: 8, title: 'Atividade 8', level: 8, unlocked: false, questions: [
      {
        id: 1,
        text: 'Qual é a capital da Austrália?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'B'
      }
    ] },
    { id: 9, title: 'Atividade 9', level: 9, unlocked: false, questions: [
      {
        id: 1,
        text: 'Qual é a capital da Rússia?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'C'
      }
    ] },
    { id: 10, title: 'Atividade 10', level: 10, unlocked: false, questions: [
      {
        id: 1,
        text: 'Qual é a capital da China?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'D'
      }
    ] },
    { id: 11, title: 'Atividade 11', level: 11, unlocked: false, questions: [
      {
        id: 1,
        text: 'Qual é a capital da Índia?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'A'
      }
    ] },
    { id: 12, title: 'Atividade 12', level: 12, unlocked: false, questions: [
      {
        id: 1,
        text: 'Qual é a capital do México?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'B'
      }
    ] },
  ];

  moreTopics: Topic[] = [
    { id: 13, title: 'Atividade 13', level: 13, unlocked: true, questions: [
      {
        id: 1,
        text: 'Qual é a capital da Argentina?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'A'
      }
    ] },
    { id: 14, title: 'Atividade 14', level: 14, unlocked: false, questions: [
      {
        id: 1,
        text: 'Qual é a capital do Chile?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'B'
      }
    ] },
    { id: 15, title: 'Atividade 15', level: 15, unlocked: false, questions: [
      {
        id: 1,
        text: 'Qual é a capital do Peru?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'C'
      }
    ] },
    { id: 16, title: 'Atividade 16', level: 16, unlocked: false, questions: [
      {
        id: 1,
        text: 'Qual é a capital da Colômbia?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'D'
      }
    ] },
    { id: 17, title: 'Atividade 17', level: 17, unlocked: false, questions: [
      {
        id: 1,
        text: 'Qual é a capital do Uruguai?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'A'
      }
    ] },
    { id: 18, title: 'Atividade 18', level: 18, unlocked: false, questions: [
      {
        id: 1,
        text: 'Qual é a capital da Venezuela?',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 'B'
      }
    ] },
  ];

  selectedTopic: Topic | null = null;
  selectedQuestion: Question | null = null;
  selectedOption: string | null = null;
  showFeedback: boolean = false;

  constructor(private modalService: NgbModal, private router: Router) {}

  isTopicUnlocked(topic: Topic): boolean {
    return topic.unlocked;
  }

  openTopicModal(content: TemplateRef<any>, topic: Topic): void {
    if (this.isTopicUnlocked(topic)) {
      this.selectedTopic = topic;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    }
  }

  selectOption(question: Question, option: string): void {
    this.selectedQuestion = question;
    this.selectedOption = option;
  }

  isCorrectOption(question: Question, option: string): boolean {
    return option === question.correctOption;
  }

  completeTopic(): void {
    this.showFeedback = true;
    if (this.selectedQuestion && this.selectedOption && !this.isCorrectOption(this.selectedQuestion, this.selectedOption)) {
      this.triggerVibration();
    } else if (this.selectedQuestion && this.selectedOption && this.isCorrectOption(this.selectedQuestion, this.selectedOption)) {
      if (this.selectedTopic) {
        const nextTopic = this.topics.find(t => t.level === this.selectedTopic!.level + 1) ||
                          this.additionalTopics.find(t => t.level === this.selectedTopic!.level + 1) ||
                          this.moreTopics.find(t => t.level === this.selectedTopic!.level + 1);
        if (nextTopic) {
          nextTopic.unlocked = true;
        }
        this.modalService.dismissAll();
      }
    }
  }

  triggerVibration(): void {
    const element = document.querySelector('.incorrect');
    if (element) {
      element.classList.add('vibrate');
      setTimeout(() => {
        element.classList.remove('vibrate');
      }, 500);
    }
  }
}
