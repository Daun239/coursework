// src/lib/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLanguage = localStorage.getItem("language") as "en" | "ua" | null;

i18n.use(initReactI18next).init({
  lng: savedLanguage ?? "en", // use stored language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: {
        clients: {
          foundCount: "Clients Found",
          searchPlaceholder: "Search clients...",
          itemsPerPage: "Items per page",
          noResults: "No clients found matching your filters",
          showFilters: "Show Filters",
          hideFilters: "Hide Filters",
          title: "Clients",
          name: "Name",
          surname: "Surname",
          email: "Email",
          cellNumber: "Cell Number",
          createClient: "Create Client",
          clientAddError: "Failed to add client. Please try again.",
          clientAddedSuccessfully: "Client added successfully",
          add: "Add",
          nameError: "Name must contain only ASCII letters (A-Z, a-z).",
          surnameError: "Surname must contain only ASCII letters (A-Z, a-z).",
          emailError: "Email is invalid (correct example - user@example.com).",
          clientDeleteError:
            "Can't delete a client if he has made a single purchase",
          clientDeletedSuccessfully: "Client deleted successfully!",
          clientUpdateError: "Failed to update client.",
          confirmDeleteClient: "Are you sure you want to delete this client?",
          delete: "Delete",
          cancel: "Cancel",
        },
        suppliers: {
          foundCount: "Suppliers Found",
          searchPlaceholder: "Search suppliers...",
          itemsPerPage: "Items per page",
          noResults: "No suppliers found matching your filters",
          showFilters: "Show Filters",
          hideFilters: "Hide Filters",
          title: "Suppliers",
          name: "Name",
          surname: "Surname",
          email: "Email",
          cellNumber: "Cell Number",
          createSupplier: "Create Supplier",
          supplierAddError: "Failed to add supplier. Please try again.",
          supplierAddedSuccessfully: "Supplier added successfully",
          supplierDeleteError:
            "Can't delete a supplier that is registered at least in as single delivery order",
          supplierDeletedSuccessfully: "Supplier deleted successfully!",
          supplierUpdateError: "Failed to update supplier.",
          confirmDeleteSupplier:
            "Are you sure you want to delete this supplier?",
        },
        employees: {
          foundCount: "Employees Found",
          searchPlaceholder: "Search employees...",
          itemsPerPage: "Items per page",
          noResults: "No employees found matching your filters",
          showFilters: "Show Filters",
          hideFilters: "Hide Filters",
          title: "Employees",
          name: "Name",
          surname: "Surname",
          email: "Email",
          cellNumber: "Cell Number",
          createEmployee: "Create Employee",
          employeeAddError: "Failed to add employee. Please try again.",
          employeeAddedSuccessfully: "Employee added successfully",
          add: "Add",
          nameError: "Name must contain only ASCII letters (A-Z, a-z).",
          surnameError: "Surname must contain only ASCII letters (A-Z, a-z).",
          emailError: "Email is invalid (correct example - user@example.com).",
          employeeDeleteError:
            "Can't delete an employee that has given away a single check, made a product placement or delivery order",
          employeeDeletedSuccessfully: "Employee deleted successfully!",
          employeeUpdateError: "Failed to update employee.",
          confirmDeleteEmployee:
            "Are you sure you want to delete this employee?",
          delete: "Delete",
          cancel: "Cancel",
          filterByCity: "Filter by City",
          filterByCinema: "Filter by Cinema",
          filterByEmployeePosition: "Filter by Position",
          selectCinema: "Select cinema",
          selectPosition: "Select position",

          staffMembers: "Staff members",
        },

        cinemas: {
          availableHalls: "Available halls",
          selectCity: "Select city",

          deleteCinemaError:
            "Can't delete a cinema if there are employees or halls",

          deleteCinemaSuccess: "Successfully deleted cinema!",
          editCinemaError: "Couldn't edit cinema",
          editCinemaSuccess: "Successfully edited cinema!",

          cinemaAddedSuccessfully: "Cinema added successfully!",
          cinemaAddedFail: "Couldn't add cinema",

          name: "Cinema name",
          address: "Address",
          city: "City",

          filterByCity: "Filter by city",

          searchByAddress: "Search by address",

          searchByName: "Search by name",

          foundCount: "Found Cinemas",

          title: "Cinemas",

          noResults: "No cinemas found matching your filters",
        },

        delete: "Delete",
        cancel: "Cancel",
        save: "Save",
        add: "Add",
        edit: "Edit",
        create: "Create",
        hall: {
          hall: "Hall",
          seats: "Seats",

          hallTechnology: "Hall technology",
          hallNumber: "Hall number",

          deletedSuccessfully: "Hall deleted successfully!",

          deletedFail: "Can't delete hall that has a seat in",
          addHall: "Add Hall",

          hallAddedSuccessfully: "Hall added successfully!",

          hallAddedFail: "Couldn't create hall",
        },

        screening: {
          processing: "Processing...",
          time: "Screening Time",
          selectLanguage: "Select a language",
          language: "Language",
          selectFormat: "Select a format",
          format: "Format",
          hall: "Hall",
          runEndDate: "Run end date:",
          runStartDate: "Run start date:",
          run: "Run",
          movie: "Movie",

          create: "Create Screening",
          update: "Update Screening",

          submitError: "Failed to save screening. Please try again.",

          createdSuccessfully: "Screening created successfully",

          updatedSuccessfully: "Screening updated successfully",

          invalidScreeningTimeOrMissingMovieRuntime:
            "Invalid screening time or missing movie runtime",

          screeningHasToOccurBetweenRunStartAndEndDates:
            "Screening has to occur between run start and end date",

          screeningHasToOccurInFuture: "Screening has to occur in the future",

          screeningTimeIsRequired: "Screening time is required",

          movieIsRequired: "Movie is required",

          languageIsRequired: "Language is required",

          screeningFormatIsRequired: "Screening format is required",

          hallIsRequired: "Hall is required",

          searchForMovie: "Search for a movie...",

          runStartDateHasToBeBeforeEndDate:
            "Run start date has to be sooner than end date",

            normalPrice: "Normal price",
            vipPrice: "Vip price",

        },

        updateHall: {
          noSeats: "No seats in database",
          currentSeats: "Current Seats in Database",
          noSeatsSelectedForDeletion: "No seats selected for deletion",
          seatsToDelete: "Seats to Delete",
          noSeatsSelectedForAddition: "No seats selected for addition",
          seatsToAdd: "Seats to Add",
          emptyCell: "Empty Cell",

          seatToDelete: "Seat to Delete",
          vipSeatToAdd: "VIP Seat to Add",
          seatToAdd: "Seat to Add",

          vipSeat: "VIP Seat",

          normalSeat: "Normal Seat",

          deleteMode: "Delete Mode",

          addMode: "Add Mode",

          manageSeatsFor: "Manage Seats for",
        },

        cart: {
          compleetPurchase: "Complete purchase",

          phone: "Phone:",
          email: "Email:",
          selectedClient: "Selected Client:",

          selectPaymentMethod: "Select payment method",
          paymentMethod: "PaymentMethod",

          total: "Total",
          tickets: "Tickets",
          products: "Products",

          selectClient: "Select client",

          yourCartIsEmpty: "Your cart is empty.",

          shoppingCart: "Shopping Cart",

          purchaseSuccessfull: "Purchase completed successfully!",

          error: "Error processing your purchase. Please try again.",

          completePurchase: "Complete Purchase",
        },
      },
    },
    ua: {
      translation: {
        clients: {
          foundCount: "Знайдено клієнтів",
          searchPlaceholder: "Пошук клієнтів...",
          itemsPerPage: "Елементів на сторінці",
          noResults: "Клієнтів за вашими фільтрами не знайдено",
          showFilters: "Показати фільтри",
          hideFilters: "Сховати фільтри",
          title: "Клієнти",
          name: "Ім'я",
          surname: "Прізвище",
          email: "Електронна пошта",
          cellNumber: "Номер телефону",
          createClient: "Створити клієнта",
          clientAddedSuccessfully: "Клієнта успішно додано",
          clientAddError: "Не вдалося додати клієнта. Спробуйте ще раз.",
          add: "Додати",
          nameError: "Ім'я повинно містити лише літери ASCII (A-Z, a-z).",
          surnameError:
            "Прізвище повинно містити лише літери ASCII (A-Z, a-z).",
          emailError:
            "Електронна пошта повинна мати правильний формат (наприклад, user@example.com).",
          clientDeleteError:
            "Клієнта не можна видалити, якщо він зробив хоча б одну покупку",
          clientDeletedSuccessfully: "Клієнта успішно видалено!",
          clientUpdateError: "Не вдалося оновити клієнта.",
          confirmDeleteClient: "Ви дійсно хочете видалити цього клієнта?",
          delete: "Видалити",
          cancel: "Скасувати",
        },
        suppliers: {
          foundCount: "Знайдено постачальників",
          searchPlaceholder: "Пошук постачальників...",
          itemsPerPage: "Елементів на сторінці",
          noResults: "Постачальників за вашими фільтрами не знайдено",
          showFilters: "Показати фільтри",
          hideFilters: "Сховати фільтри",
          title: "Постачальники",
          name: "Ім'я",
          surname: "Прізвище",
          email: "Електронна пошта",
          cellNumber: "Номер телефону",
          createSupplier: "Створити постачальника",
          supplierAddedSuccessfully: "Постачальника успішно додано",
          supplierAddError:
            "Не вдалося додати постачальника. Спробуйте ще раз.",
          supplierDeleteError:
            "Не можна видалити постачальника якщо він зазначається хоча б в одній поставці",
          supplierDeletedSuccessfully: "Постачальника успішно видалено!",
          supplierUpdateError: "Не вдалося оновити постачальника.",
          confirmDeleteSupplier:
            "Ви дійсно хочете видалити цього постачальника?",
        },
        employees: {
          foundCount: "Знайдено працівників",
          searchPlaceholder: "Пошук працівників...",
          itemsPerPage: "Елементів на сторінці",
          noResults: "Працівників за вашими фільтрами не знайдено",
          showFilters: "Показати фільтри",
          hideFilters: "Сховати фільтри",
          title: "Працівники",
          name: "Ім'я",
          surname: "Прізвище",
          email: "Електронна пошта",
          cellNumber: "Номер телефону",
          createEmployee: "Створити працівника",
          employeeAddedSuccessfully: "Працівника успішно додано",
          employeeAddError: "Не вдалося додати працівника. Спробуйте ще раз.",
          add: "Додати",
          nameError: "Ім'я повинно містити лише літери ASCII (A-Z, a-z).",
          surnameError:
            "Прізвище повинно містити лише літери ASCII (A-Z, a-z).",
          emailError:
            "Електронна пошта повинна мати правильний формат (наприклад, user@example.com).",
          employeeDeleteError:
            "Не можна видалити працівника, який замовив хоча б одну поставку, зробив одне розміщення товарів чи видав один чек",
          employeeDeletedSuccessfully: "Працівника успішно видалено!",
          employeeUpdateError: "Не вдалося оновити працівника.",
          confirmDeleteEmployee: "Ви дійсно хочете видалити цього працівника?",
          delete: "Видалити",
          cancel: "Скасувати",
          filterByCity: "Фільтрувати за містом",
          filterByCinema: "Фільтрувати за кінотеатром",
          filterByEmployeePosition: "Фільтрувати за посадою",
          selectCinema: "Вибрати кінотеатр",
          selectPosition: "Вибрати посаду",

          staffMembers: "Кількість працівників",
        },

        cinemas: {
          availableHalls: "Наявні зали",
          selectCity: "Виберіть місто",

          deleteCinemaError:
            "Не можна видалити кінотеатр якщо в ньому працюють люди або містяться зали",
          deleteCinemaSuccess: "Успішно видалено кінотеатр!",

          editCinemaError: "Не вдалося змінити кінотеатр",
          editCinemaSuccess: "Успішно змінено кінотеатр!",

          cinemaAddedSuccessfully: "Кінотеатр успішно створено!",
          cinemaAddedFail: "Система не змогла створити кінотеатр",

          name: "Назва кінотеатру",
          address: "Адреса",
          city: "Місто",

          filterByCity: "Фільтрувати за містом",
          searchByAddress: "Пошук за адресою",
          searchByName: "Пошук за назвою",
          foundCount: "Знайдено кінотеатрів",
          title: "Кінотеатри",
          noResults: "Не знайдено кінотеатрів за заданими фільтрами",
        },

        delete: "Видалити",
        cancel: "Відмінити",
        save: "Зберегти",
        add: "Додати",
        edit: "Змінити",
        create: "Створити",

        hall: {
          hall: "Зал",
          seats: "Сидінь",
          hallTechnology: "Технологія залу",
          hallNumber: "Номер залу",

          deletedSuccessfully: "Зал успішно видалено!",

          hallAddedSuccessfully: "Зал успішно додано!",

          hallAddedFail: "Не зміг створити зал",

          deletedFail: "Неможливо видалити зал, в якому є сидіння",

          addHall: "Додати зал",
        },

        screening: {
          processing: "Обробка...",
          time: "Час показу",
          selectLanguage: "Оберіть мову",
          language: "Мова",
          selectFormat: "Оберіть формат",
          format: "Формат",
          hall: "Зал",
          runEndDate: "Дата завершення прокату:",
          runStartDate: "Дата початку прокату:",
          run: "Прокат",
          movie: "Фільм",

          create: "Створити сеанс",
          update: "Редагувати сеанс",

          submitError: "Не вдалося зберегти сеанс. Спробуйте ще раз.",

          createdSuccessfully: "Сеанс успішно створено",

          updatedSuccessfully: "Сеанс успішно оновлено",

          invalidScreeningTimeOrMissingMovieRuntime:
            "Невірний час сеансу або відсутня тривалість фільму",

          screeningHasToOccurBetweenRunStartAndEndDates:
            "Сеанс має відбуватись між датами початку та завершення прокату",

          screeningHasToOccurInFuture: "Сеанс має відбуватись у майбутньому",

          screeningTimeIsRequired: "Час сеансу є обовʼязковим",

          movieIsRequired: "Фільм є обовʼязковим",

          languageIsRequired: "Мова є обовʼязковою",

          screeningFormatIsRequired: "Формат показу є обовʼязковим",

          hallIsRequired: "Зал є обовʼязковим",

          searchForMovie: "Шукайте фільм...",

          runStartDateHasToBeBeforeEndDate:
            "Кінець прокату повинен бути пізніше за початок",

            normalPrice: "Звичайна ціна",
            vipPrice: "ВІП ціна",

        },

        updateHall: {
          noSeats: "Немає місць у базі даних",
          currentSeats: "Поточні місця в базі даних",
          noSeatsSelectedForDeletion: "Не вибрано місць для видалення",
          seatsToDelete: "Місця для видалення",
          noSeatsSelectedForAddition: "Не вибрано місць для додавання",
          seatsToAdd: "Місця для додавання",
          emptyCell: "Порожня клітинка",

          seatToDelete: "Місце для видалення",
          vipSeatToAdd: "VIP-місце для додавання",
          seatToAdd: "Місце для додавання",

          vipSeat: "VIP-місце",
          normalSeat: "Звичайне місце",

          deleteMode: "Режим видалення",
          addMode: "Режим додавання",

          manageSeatsFor: "Керування місцями для",
        },

        cart: {
          compleetPurchase: "Завершити покупку",

          selectClient: "Обрати клієнта",
          phone: "Телефон:",
          email: "Електронна пошта:",
          selectedClient: "Обраний клієнт:",

          selectPaymentMethod: "Оберіть спосіб оплати",
          paymentMethod: "Спосіб оплати",

          total: "Разом",
          tickets: "Квитки",
          products: "Продукти",

          yourCartIsEmpty: "Ваш кошик порожній.",

          shoppingCart: "Кошик покупок",

          purchaseSuccessfull: "Покупку успішно завершено!",

          error: "Помилка під час обробки покупки. Спробуйте ще раз.",

          completePurchase: "Виконати покупку",
        },
      },
    },
  },
});

export default i18n;
