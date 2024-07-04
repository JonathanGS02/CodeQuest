import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, Topico, Question, QuestaoTopico } from '../../services/api.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  introductionTopics: Topico[] = [];
  controlStructureTopics: Topico[] = [];
  functionsTopics: Topico[] = [];

  selectedTopic: Topico | null = null;
  selectedQuestion: Question | null = null;
  selectedOption: string | null = null;
  showFeedback: boolean = false;
  showSuccessModal: boolean = false; // Controle para o pop-up de sucesso
  acquiredXp: number = 0; // XP adquirido na resposta correta

  userLevel: number = 1; // Nível inicial do usuário
  userXp: number = 0; // XP inicial do usuário
  xpForNextLevel: number = 100; // XP necessária para o próximo nível

  constructor(private modalService: NgbModal, private apiService: ApiService, private userService: UserService) {}

  ngOnInit(): void {
    this.apiService.getTopics().subscribe({
      next: (topics) => {
        topics.forEach(topic => {
          if (topic.questaoTopicos) {
            topic.questoes = topic.questaoTopicos.map(qt => qt.questao);
          }

          topic.unlocked = topic.nivel <= this.userLevel;

          if (topic.questoes?.some(q => q.titulo.includes('linguagem de programação') || q.titulo.includes('Componentes principais de um programa'))) {
            this.introductionTopics.push(topic);
          } else if (topic.questoes?.some(q => q.titulo.includes('estrutura de controle'))) {
            this.controlStructureTopics.push(topic);
          } else if (topic.questoes?.some(q => q.titulo.includes('função'))) {
            this.functionsTopics.push(topic);
          }
        });

        this.updateTopicUnlockStatus();
      },
      error: (err) => {
        console.error('Failed to load topics:', err);
      }
    });
  }

  isTopicUnlocked(topic: Topico): boolean {
    return topic.unlocked ?? false;
  }

  openTopicModal(content: TemplateRef<any>, topic: Topico): void {
    if (this.isTopicUnlocked(topic)) {
      this.selectedTopic = topic;
      if (this.selectedTopic.questoes && this.selectedTopic.questoes.length > 0) {
        this.selectedQuestion = this.getRandomQuestion(this.selectedTopic.questoes);
      }
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    }
  }

  getRandomQuestion(questions: Question[]): Question {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }

  selectOption(question: Question, option: string): void {
    this.selectedQuestion = question;
    this.selectedOption = option;
    this.showFeedback = false; // Resetar o feedback ao selecionar uma nova opção
  }

  isCorrectOption(question: Question, option: string): boolean {
    return (question.perguntaCorreta1 && option === question.pergunta1) ||
           (question.perguntaCorreta2 && option === question.pergunta2) ||
           (question.perguntaCorreta3 && option === question.pergunta3) ||
           (question.perguntaCorreta4 && option === question.pergunta4) ||
           (question.perguntaCorreta5 && option === question.pergunta5) ||
           (question.perguntaCorreta6 && option === question.pergunta6);
  }

  completeTopic(successModal: TemplateRef<any>): void {
    this.showFeedback = true;
    if (this.selectedQuestion && this.selectedOption && !this.isCorrectOption(this.selectedQuestion, this.selectedOption)) {
      this.triggerVibration();
    } else if (this.selectedQuestion && this.selectedOption && this.isCorrectOption(this.selectedQuestion, this.selectedOption)) {
      this.acquiredXp = Number(this.selectedQuestion.exp);
      this.userXp += this.acquiredXp;
      while (this.userXp >= this.xpForNextLevel) {
        this.userLevel++;
        this.userXp -= this.xpForNextLevel;
        this.updateTopicUnlockStatus();
      }
      this.modalService.dismissAll();
      this.modalService.open(successModal, { ariaLabelledBy: 'modal-success-title' }); // Mostrar o pop-up de sucesso
    }
  }

  updateTopicUnlockStatus(): void {
    this.introductionTopics.forEach(topic => {
      topic.unlocked = topic.nivel <= this.userLevel;
    });
    this.controlStructureTopics.forEach(topic => {
      topic.unlocked = topic.nivel <= this.userLevel;
    });
    this.functionsTopics.forEach(topic => {
      topic.unlocked = topic.nivel <= this.userLevel;
    });
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
