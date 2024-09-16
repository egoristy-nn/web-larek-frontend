import './scss/styles.scss';
import { LarekApi } from './components/model/LarekApi';
import { AppState } from './components/model/AppState';
import { API_URL} from './utils/constants';
import { Card, CardBasket, CardModal } from './components/view/Card';
import { cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { Page } from './components/view/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Order } from './components/view/Order';
import { Contacts } from './components/view/Contacts';
import { Success } from './components/common/Success';
import { IContactsForm, IOrderForm } from './types';

// экземпляры классов
const events = new EventEmitter();

// модель данных
const appModel = new AppState(events);

// глобальные контейнеры
const page = new Page(document.querySelector('.page__wrapper') as HTMLElement, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);
// темплейты
const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardModalTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

// API
const api = new LarekApi(API_URL);
api.getItemList()
.then(data => {
  appModel.setCatalog(data.items);
})
.catch(err => {
  console.error(err);
})

// обрабатываем события
events.on('catalog:changed', () => {
  const itemsHTMLArray = appModel.getItems().map(item => new Card(cloneTemplate(cardTemplate)).render(item));
  const itemsModalHTMLArray = appModel.getItems().map(item => new CardModal(cloneTemplate(cardModalTemplate), events).render(item));
  itemsHTMLArray.forEach(item => {
    item.addEventListener('click', () => {
      modal.render({
        content: itemsModalHTMLArray[itemsHTMLArray.indexOf(item)]
      })
    })
  })

  page.render({
    itemsList: itemsHTMLArray,
    basket: document.querySelector('.header__basket') as HTMLElement,
    counter: appModel.getCounter()
  })
})

// корзина открыта
events.on('basket:open', () => {
  const ordersId = appModel.getOrder().items;
  const cardBasketHTMLArray = ordersId.map((item) => 
    new CardBasket(cloneTemplate(cardBasketTemplate), events).render(appModel.getItem(item)));
  modal.render({
    content: basket.render({
      items: cardBasketHTMLArray,
      total: appModel.getTotal(),
    })
  })

  for (let i = 0; i < cardBasketHTMLArray.length; i++) {
    cardBasketHTMLArray[i].querySelector('.basket__item-index').textContent = (i + 1).toString();
  }
})

// товар добавлен в корзину
events.on('item:added', (data: { id: string, price: number}) => {
  if (!appModel.getOrder().items.includes(data.id)) {
    appModel.addOrderItem(data.id);
    appModel.setTotal(data.price + appModel.getTotal());
    console.log(appModel.getOrder())
    page.render({
      counter: appModel.getCounter()
    })
  }
  else {
    throw new Error('Товар уже в корзине');
  }
})

// товар удален из корзины
events.on('item:deleted', (data: { id: string, price: number}) => {
  if (appModel.getOrder().items.includes(data.id)) {
    appModel.deleteOrderItem(data.id);
    appModel.setTotal(appModel.getTotal() - data.price);
    console.log(appModel.getOrder())
    const orderList = appModel.getOrder().items.map(item => new CardBasket(cloneTemplate(cardBasketTemplate), events).render(appModel.getItem(item)));
    page.render({
      counter: appModel.getCounter()
    })
    basket.render({
      items: orderList,
      total: appModel.getTotal()
    });
  }
  else {
    throw new Error('Данный товар отсутствует в корзине');
  }
  
})

// открыть форму заказа
events.on('basket:submit', () => {
  modal.close();
  modal.render({
    content: order.render({
      address: '',
      valid: false,
      errors: []
    })
  })
})

// выбрать способ оплаты
events.on('tab:selected', (data: { name: string }) => {
  if (data.name === 'card') {
    appModel.setPayment('card');
    console.log(appModel.getOrder())
    order.selected = 'card';
  }
  else {
    appModel.setPayment('cash');
    console.log(appModel.getOrder())
    order.selected = 'cash';
  }
  
})

// отправлена форма адреса и способ оплаты
events.on('order:submit', () => {
  appModel.setAddress(order.address);
  console.log(appModel.getOrder())
  modal.close();
  modal.render({
    content: contacts.render({
      email: '',
      phone: '',
      valid: false,
      errors: []
    })
  })
})

// отправлена форма контактов
events.on('contacts:submit', () => {
  appModel.setEmail(contacts.email);
  appModel.setPhone(contacts.phone);
  console.log(appModel.getOrder())
  api.orderItems(appModel.getOrder())
  .then((res) => {
    modal.close();
    modal.render({
      content: success.render({
        total: appModel.getTotal()
      })
    })
  appModel.clearBasket();
  page.render({
    counter: appModel.getCounter()
  })
  })
  .catch(err => {
    console.error(err)
  })
})

// закрыть окно успешного заказа
events.on('success:close', () => {
  modal.close();
})

// изменилось состояние валидации поля адреса
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
  const { address} = errors;
  order.valid = !address;
  order.errors = Object.values({address}).filter(i => !!i).join('; ');
});

// изменилось состояние валидации полей контактов
events.on('contactsFormErrors:change', (errors: Partial<IContactsForm>) => {
  const {email, phone} = errors;
  contacts.valid = !email && !phone;
  contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось поле адреса
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
  appModel.setOrderField(data.field, data.value);
});

// Изменились поля контактов
events.on(/^contacts\..*:change/, (data: { field: keyof IContactsForm, value: string }) => {
  appModel.setContactsField(data.field, data.value);
});

// блокируем прокрутку страницы, если открыто модальное окно
events.on('modal:open', () => {
  page.locked = true;
})

// разблокируем прокрутку страницы
events.on('modal:close', () => {
  page.locked = false;
})

