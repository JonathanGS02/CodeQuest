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

  userLevel: number = 1; // Nível inicial do usuário
  userXp: number = 0; // XP inicial do usuário
  xpForNextLevel: number = 100; // XP necessária para o próximo nível

  constructor(private modalService: NgbModal, private apiService: ApiService, private userService: UserService) {}

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

          if(topic.nivel == this.userLevel){
            topic.unlocked = true;
          }else{
            topic.unlocked = false
          }

          console.log(`Topic Nivel: ${topic.nivel}, User Level: ${this.userLevel}`);
          // Inicializa o status de desbloqueio do tópico
          topic.unlocked = topic.nivel <= this.userLevel;
          console.log(`Topic ${topic.topicoId} unlocked status: ${topic.unlocked}`);

          // Separar os tópicos em categorias
          if (topic.questoes?.some(q => q.titulo.includes('linguagem de programação') || q.titulo.includes('Componentes principais de um programa'))) {
            this.introductionTopics.push(topic);
          } else if (topic.questoes?.some(q => q.titulo.includes('estrutura de controle'))) {
            this.controlStructureTopics.push(topic);
          } else if (topic.questoes?.some(q => q.titulo.includes('função'))) {
            this.functionsTopics.push(topic);
          }
        });
        console.log('Introduction topics:', this.introductionTopics);
        console.log('Control Structure topics:', this.controlStructureTopics);
        console.log('Functions topics:', this.functionsTopics);

        // Atualiza o status de desbloqueio dos tópicos após carregá-los
        this.updateTopicUnlockStatus();
      },
      error: (err) => {
        console.error('Failed to load topics:', err);
      }
    });
  }

  isTopicUnlocked(topic: Topico): boolean {
    console.log(`Checking if topic ${topic.topicoId} is unlocked: ${topic.unlocked}`);
    return topic.unlocked ?? false;  // Verifica se o tópico está desbloqueado, garantindo que `unlocked` seja um booleano
  }

  openTopicModal(content: TemplateRef<any>, topic: Topico): void {
    if (this.isTopicUnlocked(topic)) {
      this.selectedTopic = topic;
      if (this.selectedTopic.questoes && this.selectedTopic.questoes.length > 0) {
        this.selectedQuestion = this.getRandomQuestion(this.selectedTopic.questoes);
      }
      console.log('Selected topic:', this.selectedTopic);
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
      if (this.selectedQuestion) {
        this.userXp += Number(this.selectedQuestion.exp); // Adiciona XP da questão ao XP do usuário e garante que seja número
        console.log('User XP updated to:', this.userXp);

        // Verifica se o usuário atingiu a XP necessária para subir de nível
        while (this.userXp >= this.xpForNextLevel) {
          this.userLevel++;
          this.userXp -= this.xpForNextLevel;
          console.log('User level updated to:', this.userLevel);

          // Atualiza o status de desbloqueio dos tópicos
          this.updateTopicUnlockStatus();
        }

        this.modalService.dismissAll();
      }
    }
  }

  updateTopicUnlockStatus(): void {
    this.introductionTopics.forEach(topic => {
      topic.unlocked = topic.nivel <= this.userLevel;
      console.log(`Updated topic ${topic.topicoId} unlocked status to: ${topic.unlocked}`);
    });
    this.controlStructureTopics.forEach(topic => {
      topic.unlocked = topic.nivel <= this.userLevel;
      console.log(`Updated topic ${topic.topicoId} unlocked status to: ${topic.unlocked}`);
    });
    this.functionsTopics.forEach(topic => {
      topic.unlocked = topic.nivel <= this.userLevel;
      console.log(`Updated topic ${topic.topicoId} unlocked status to: ${topic.unlocked}`);
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
