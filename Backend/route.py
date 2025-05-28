from flask import Blueprint, Response, json
from models import Reservation, Contact, Apartment

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
