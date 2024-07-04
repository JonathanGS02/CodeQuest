import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, Topico, Question, QuestaoTopico } from '../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  topics: Topico[] = [];
  additionalTopics: Topico[] = [];
  moreTopics: Topico[] = [];

  selectedTopic: Topico | null = null;
  selectedQuestion: Question | null = null;
  selectedOption: string | null = null;
  showFeedback: boolean = false;

  constructor(private modalService: NgbModal, private apiService: ApiService) {}

  ngOnInit(): void {
    console.log('HomeComponent initialized');
    this.apiService.getTopics().subscribe({
      next: (topics) => {
        console.log('Topics loaded:', topics);
        topics.forEach(topic => {
          console.log('Processing topic:', topic);
          if (topic.questaoTopicos) {
            topic.questoes = topic.questaoTopicos.map(qt => qt.questao);
          }
          // Adicione um valor padrão para Nivel se não estiver definido
          if (topic.Nivel === undefined || topic.Nivel === null) {
            topic.Nivel = 1; // ou outro valor padrão apropriado
          }
          console.log('Processed topic:', topic);
        });
        this.topics = topics.filter(t => t.Nivel !== undefined && t.Nivel <= 6);
        this.additionalTopics = topics.filter(t => t.Nivel !== undefined && t.Nivel > 6 && t.Nivel <= 12);
        this.moreTopics = topics.filter(t => t.Nivel !== undefined && t.Nivel > 12);
        console.log('Filtered topics:', this.topics);
        console.log('Filtered additionalTopics:', this.additionalTopics);
        console.log('Filtered moreTopics:', this.moreTopics);
      },
      error: (err) => {
        console.error('Failed to load topics:', err);
      }
    });
  }

  isTopicUnlocked(topic: Topico): boolean {
    return true; // Ajuste conforme a lógica de desbloqueio
  }

  openTopicModal(content: TemplateRef<any>, topic: Topico): void {
    if (this.isTopicUnlocked(topic)) {
      this.selectedTopic = topic;
      console.log('Selected topic:', this.selectedTopic);
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    }
  }

  selectOption(question: Question, option: string): void {
    this.selectedQuestion = question;
    this.selectedOption = option;
  }

  isCorrectOption(question: Question, option: string): boolean {
    return (question.perguntaCorreta1 && option === question.pergunta1) ||
           (question.perguntaCorreta2 && option === question.pergunta2) ||
           (question.perguntaCorreta3 && option === question.pergunta3) ||
           (question.perguntaCorreta4 && option === question.pergunta4) ||
           (question.perguntaCorreta5 && option === question.pergunta5) ||
           (question.perguntaCorreta6 && option === question.pergunta6);
  }

  completeTopic(): void {
    this.showFeedback = true;
    if (this.selectedQuestion && this.selectedOption && !this.isCorrectOption(this.selectedQuestion, this.selectedOption)) {
      this.triggerVibration();
    } else if (this.selectedQuestion && this.selectedOption && this.isCorrectOption(this.selectedQuestion, this.selectedOption)) {
      if (this.selectedTopic) {
        const nextTopic = this.topics.find(t => t.Nivel === this.selectedTopic!.Nivel! + 1) ||
                          this.additionalTopics.find(t => t.Nivel === this.selectedTopic!.Nivel! + 1) ||
                          this.moreTopics.find(t => t.Nivel === this.selectedTopic!.Nivel! + 1);
        if (nextTopic) {
          // Adicione a lógica para desbloquear o próximo tópico aqui
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
