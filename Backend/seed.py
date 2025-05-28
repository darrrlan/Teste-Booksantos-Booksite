from datetime import date
from app import app, db
from models import Apartment, Contact, Reservation

with app.app_context():
    db.create_all()

    # Apartamentos
    apartments = [
        Apartment(title="Apartamento Central", city="São Paulo", state="SP", max_guests=4, daily_rate=250.00),
        Apartment(title="Casa de Praia", city="Rio de Janeiro", state="RJ", max_guests=6, daily_rate=350.00),
        Apartment(title="Loft Moderno", city="Belo Horizonte", state="MG", max_guests=2, daily_rate=200.00),
        Apartment(title="Cobertura Luxo", city="Curitiba", state="PR", max_guests=5, daily_rate=500.00),
        Apartment(title="Flat Executivo", city="Brasília", state="DF", max_guests=3, daily_rate=300.00),
        Apartment(title="Apartamento Compacto", city="Porto Alegre", state="RS", max_guests=2, daily_rate=180.00),
        Apartment(title="Suíte Vista Mar", city="Salvador", state="BA", max_guests=4, daily_rate=400.00),
        Apartment(title="Pousada das Flores", city="Recife", state="PE", max_guests=5, daily_rate=270.00),
        Apartment(title="Chalé da Montanha", city="Gramado", state="RS", max_guests=3, daily_rate=320.00),
        Apartment(title="Residência Urbana", city="Campinas", state="SP", max_guests=6, daily_rate=290.00)
    ]

    # Contatos
    contacts = [
        Contact(name="João Silva", email="joao@email.com", phone="11999990001", type="individual", document="12345678900"),
        Contact(name="Maria Santos", email="maria@email.com", phone="21999990002", type="individual", document="98765432100"),
        Contact(name="Empresa XPTO", email="contato@xpto.com", phone="11999990003", type="company", document="11222333444455"),
        Contact(name="Carlos Lima", email="carlos@email.com", phone="31999990004", type="individual", document="10293847566"),
        Contact(name="Ana Beatriz", email="ana@email.com", phone="41999990005", type="individual", document="99887766554"),
        Contact(name="Pedro Oliveira", email="pedro@email.com", phone="51999990006", type="individual", document="88776655443"),
        Contact(name="Empresa Alpha", email="alpha@corp.com", phone="61999990007", type="company", document="55443322110099"),
        Contact(name="Luciana Melo", email="luciana@email.com", phone="71999990008", type="individual", document="22334455667"),
        Contact(name="Ricardo Dias", email="ricardo@email.com", phone="81999990009", type="individual", document="33445566778"),
        Contact(name="Fernanda Costa", email="fernanda@email.com", phone="91999990010", type="individual", document="44556677889")
    ]

    db.session.add_all(apartments + contacts)
    db.session.commit()

    # Reservas
    reservations = [
        Reservation(apartment=apartments[0], contact=contacts[0], checkin_date=date(2025, 6, 1), checkout_date=date(2025, 6, 5), guests=2, total_price=1000.00, channel="airbnb"),
        Reservation(apartment=apartments[1], contact=contacts[1], checkin_date=date(2025, 7, 10), checkout_date=date(2025, 7, 15), guests=4, total_price=1750.00, channel="booking"),
        Reservation(apartment=apartments[2], contact=contacts[2], checkin_date=date(2025, 8, 20), checkout_date=date(2025, 8, 25), guests=1, total_price=1000.00, channel="direct"),
        Reservation(apartment=apartments[3], contact=contacts[3], checkin_date=date(2025, 9, 5), checkout_date=date(2025, 9, 10), guests=3, total_price=2500.00, channel="airbnb"),
        Reservation(apartment=apartments[4], contact=contacts[4], checkin_date=date(2025, 10, 1), checkout_date=date(2025, 10, 3), guests=2, total_price=600.00, channel="vrbo"),
        Reservation(apartment=apartments[5], contact=contacts[5], checkin_date=date(2025, 6, 12), checkout_date=date(2025, 6, 14), guests=2, total_price=360.00, channel="booking"),
        Reservation(apartment=apartments[6], contact=contacts[6], checkin_date=date(2025, 11, 5), checkout_date=date(2025, 11, 10), guests=4, total_price=2000.00, channel="airbnb"),
        Reservation(apartment=apartments[7], contact=contacts[7], checkin_date=date(2025, 12, 1), checkout_date=date(2025, 12, 4), guests=3, total_price=810.00, channel="direct"),
        Reservation(apartment=apartments[8], contact=contacts[8], checkin_date=date(2025, 5, 20), checkout_date=date(2025, 5, 23), guests=2, total_price=960.00, channel="booking"),
        Reservation(apartment=apartments[9], contact=contacts[9], checkin_date=date(2025, 6, 15), checkout_date=date(2025, 6, 20), guests=5, total_price=1450.00, channel="vrbo")
    ]

    db.session.add_all(reservations)
    db.session.commit()

    print("✅ Seed com 10 registros inserido com sucesso.")
