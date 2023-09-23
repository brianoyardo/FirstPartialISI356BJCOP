/*Solution

SOLID Principles:
Single Responsibility Principle: La clase LibraryManager se ocupa únicamente de la lógica de la biblioteca, mientras que el servicio EmailService se ocupa del envío de correos electrónicos.
Open/Closed Principle: Las clases están abiertas para extensión (por ejemplo, añadiendo más tipos de notificaciones) pero cerradas para modificación.
Liskov Substitution Principle: User implementa la interfaz IObserver, lo que significa que se puede sustituir por cualquier otro objeto que también implemente la interfaz.
Dependency Inversion Principle: Se inyecta IEmailService en LibraryManager, lo que significa que LibraryManager no depende de una implementación concreta.

Inyección de Dependencias:
Inyectar IEmailService en LibraryManager.

Lambda Expressions:
Usar expresiones lambda en funciones como find y forEach.

Singleton Pattern:
Garantizar que solo haya una instancia de LibraryManager con el método getInstance.

Observer Pattern:
Los usuarios (User) se registran como observadores y son notificados cuando se añade un nuevo libro.

Builder Pattern:
Se utiliza para construir instancias de Book de una manera más limpia y escalable.

Refactorización:
eliminar el uso de ANY mejorar el performance

Aspectos (Opcional)
Puedes anadir logs de info, warning y error en las llamadas, para un mejor control

Diseño por Contrato (Opcional):
Puedes anadir validaciones en precondiciones o postcondiciones como lo veas necesario*/


//Solucion:

class Book {
    constructor(public title: string, public author: string, public ISBN: string) {}
}
interface IEmailService {
    sendEmail(userID: string, message: string): void;
}
class EmailService implements IEmailService {
    sendEmail(userID: string, message: string): void {
      console.log(`Enviando email a ${userID}: ${message}`);
    }
}
interface IObserver {
    update(book: Book): void;
}

class User implements IObserver {
    constructor(private userID: string) {}
  
    update(book: Book): void {
      console.log(`Usuario ${this.userID}: Se ha agregado un nuevo libro - ${book.title}`);
    }
}

class Library {
    private books: Book[] = [];
    private observers: IObserver[] = [];
  
    addBook(title: string, author: string, ISBN: string) {
      const newBook = new Book(title, author, ISBN);
      this.books.push(newBook);
      this.notifyObservers(newBook);
    }

    removeBook(ISBN: string) {
      const index = this.books.findIndex(book => book.ISBN === ISBN);
      if (index !== -1) {
        this.books.splice(index, 1);
      }
    }
  
    private notifyObservers(book: Book) {
      this.observers.forEach(observer => observer.update(book));
    }
  
    registerObserver(observer: IObserver) {
      this.observers.push(observer);
    }

    getBookByISBN(ISBN: string): Book{
        return this.books.find(book => book.ISBN === ISBN);
      }
}

class LoanManager{
    private loans: any[] = [];
    private emailService: IEmailService;

    constructor(emailservice: IEmailService ){
        this.emailService = emailservice;
    }

    loanBook(ISBN: string, userID: string, book: Book ){
        this.loans.push({ ISBN, userID, date: new Date() });
        this.emailService.sendEmail(userID, `Has solicitado el libro ${book.title}`);
    }
    returnBook(ISBN: string, userID: string, book: Book){
        const index = this.loans.findIndex(loan => loan.ISBN === ISBN && loan.userID === userID);
      if (index !== -1) {
        this.loans.splice(index, 1);
        this.emailService.sendEmail(userID, `Has devuelto el libro con ISBN ${ISBN}. Gracias....!`);
      }
    }
}


const emailService = new EmailService();
var  library = new Library();
const loanManager = new LoanManager(emailService);

const Mancha1 = new User("ManchasUser");
library.registerObserver(Mancha1);



library.addBook("El Gran Gatsby", "F. Scott Fitzgerald", "123456789");
library.addBook("1984", "George Orwell", "987654321");
let aux = library.getBookByISBN("123456789");
loanManager.loanBook("123456789", "Mancha1",aux);//Hay un pequeño error aqui que no puedo idetificar ing.