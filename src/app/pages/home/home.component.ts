import { Component, TemplateRef, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ApiService, Topic, Question } from '../../services/api.service';  // Certifique-se de que o caminho está correto

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  topics: Topic[] = [];
  additionalTopics: Topic[] = [];
  moreTopics: Topic[] = [];

  selectedTopic: Topic | null = null;
  selectedQuestion: Question | null = null;
  selectedOption: string | null = null;
  showFeedback: boolean = false;

  constructor(private modalService: NgbModal, private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    console.log('HomeComponent initialized');
    this.apiService.getTopics().subscribe({
      next: (topics) => {
        console.log('Topics loaded:', topics);
        this.topics = topics.filter(t => t.level <= 6); // Ajuste os níveis conforme necessário
        this.additionalTopics = topics.filter(t => t.level > 6 && t.level <= 12);
        this.moreTopics = topics.filter(t => t.level > 12);
      },
      error: (err) => {
        console.error('Failed to load topics:', err);
      }
    });
  }

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

  getOptions(question: Question): string[] {
    return [question.pergunta1, question.pergunta2, question.pergunta3, question.pergunta4, question.pergunta5, question.pergunta6];
  }
}
