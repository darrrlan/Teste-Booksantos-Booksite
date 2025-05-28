from flask import Blueprint, Response, json, request
from models import Reservation, Contact, Apartment, db
from datetime import datetime


bp = Blueprint('routes', __name__)

@bp.route('/')
def home():
    data = {'message': 'API de Gestão do Booksite'}
    response = Response(json.dumps(data, ensure_ascii=False), content_type='application/json; charset=utf-8')
    return response

@bp.route('/reservas', methods=['GET'])
def listar_reservas():
    reservas = Reservation.query.all()
    resultado = []
    for r in reservas:
        resultado.append({
            'apartment': {
                'id': r.apartment.id,
                'title': r.apartment.title,
                'city': r.apartment.city,
                'state':r.apartment.state,
                'max_guests': r.apartment.max_guests,
                'daily_rate':r.apartment.daily_rate
            },
            'contact': {
                'id': r.contact.id,
                'name': r.contact.name,
                'email': r.contact.email,
                'phone': r.contact.phone,
                'type': r.contact.type,
                'document': r.contact.document
            },
            'reserva':{
                'id': r.id,
            'checkin': r.checkin_date.isoformat(),
            'checkout': r.checkout_date.isoformat(),
            'guests': r.guests,
            'total_price': float(r.total_price),
            'channel': r.channel
            }
        })
    json_data = json.dumps(resultado, ensure_ascii=False, indent=2,sort_keys=False)
    print(json_data)
    return Response(json_data, mimetype='application/json; charset=utf-8')


@bp.route('/apartamentos', methods=['GET'])
def listar_apartment():
    apartamentos = Apartment.query.all()
    resultado = []
    for r in apartamentos:
        resultado.append({
            'apartment': {
                'id': r.id,
                'title': r.title,
                'city': r.city,
                'state':r.state,
                'max_guests': r.max_guests,
                'daily_rate':r.daily_rate
            }
        })
    json_data = json.dumps(resultado, ensure_ascii=False, indent=2,sort_keys=False)
    return Response(json_data, mimetype='application/json; charset=utf-8')

@bp.route('/contatos', methods=['GET'])
def listar_contact():
    contatos = Contact.query.all()
    resultado = []
    for r in contatos:
        resultado.append({
            'contact': {
                'id': r.id,
                'name': r.name,
                'email': r.email,
                'phone': r.phone,
                'type': r.type,
                'document': r.document
            },
        })
    json_data = json.dumps(resultado, ensure_ascii=False, indent=2,sort_keys=False)
    return Response(json_data, mimetype='application/json; charset=utf-8')

from flask import request

@bp.route('/criarreserva', methods=['POST'])
def criar_reserva():
    data = request.get_json() 
    print(data)
    try:
        nova_reserva = Reservation(
            apartment_id = data['apartment_id'],
            contact_id = data['contact_id'],
            checkin_date=datetime.strptime(data['checkin'], "%Y-%m-%d"),
            checkout_date=datetime.strptime(data['checkout'], "%Y-%m-%d"),
            guests = data['guests'],
            channel = data['channel'],
            total_price = data['total_price']
        )
            
        db.session.add(nova_reserva)
        db.session.commit()

        msg = {"mensagem": "Reserva criada com sucesso!"}
        return Response(json.dumps(msg, ensure_ascii=False), content_type='application/json; charset=utf-8'), 201
            
    except Exception as e:
        print(f"Erro ao criar reserva: {e}")
        msg = {"erro": "Erro ao criar reserva"}
        return Response(json.dumps(msg, ensure_ascii=False), content_type='application/json; charset=utf-8'), 500
