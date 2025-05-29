from flask import Blueprint, Response, json, request, redirect
from models import Reservation, Contact, Apartment, Login, db
from datetime import datetime, timedelta
from sqlalchemy import func, and_, or_, not_
import bcrypt


bp = Blueprint("routes", __name__)


@bp.route("/")
def home():
    data = {"message": "API de Gestão do Booksite"}
    response = Response(
        json.dumps(data, ensure_ascii=False),
        content_type="application/json; charset=utf-8",
    )
    return response


@bp.route("/reservas", methods=["GET"])
def listar_reservas():
    reservas = Reservation.query.all()
    resultado = []
    for r in reservas:
        resultado.append(
            {
                "apartment": {
                    "id": r.apartment.id,
                    "title": r.apartment.title,
                    "city": r.apartment.city,
                    "state": r.apartment.state,
                    "max_guests": r.apartment.max_guests,
                    "daily_rate": r.apartment.daily_rate,
                },
                "contact": {
                    "id": r.contact.id,
                    "name": r.contact.name,
                    "email": r.contact.email,
                    "phone": r.contact.phone,
                    "type": r.contact.type,
                    "document": r.contact.document,
                },
                "reserva": {
                    "id": r.id,
                    "checkin": r.checkin_date.isoformat(),
                    "checkout": r.checkout_date.isoformat(),
                    "guests": r.guests,
                    "total_price": float(r.total_price),
                    "channel": r.channel,
                },
            }
        )
    json_data = json.dumps(resultado, ensure_ascii=False, indent=2, sort_keys=False)
    return Response(json_data, mimetype="application/json; charset=utf-8")


@bp.route("/apartamentos", methods=["GET"])
def listar_apartment():
    apartamentos = Apartment.query.all()
    resultado = []
    for r in apartamentos:
        resultado.append(
            {
                "apartment": {
                    "id": r.id,
                    "title": r.title,
                    "city": r.city,
                    "state": r.state,
                    "max_guests": r.max_guests,
                    "daily_rate": r.daily_rate,
                }
            }
        )
    json_data = json.dumps(resultado, ensure_ascii=False, indent=2, sort_keys=False)
    return Response(json_data, mimetype="application/json; charset=utf-8")


@bp.route("/contatos", methods=["GET"])
def listar_contact():
    contatos = Contact.query.all()
    resultado = []
    for r in contatos:
        resultado.append(
            {
                "contact": {
                    "id": r.id,
                    "name": r.name,
                    "email": r.email,
                    "phone": r.phone,
                    "type": r.type,
                    "document": r.document,
                },
            }
        )
    json_data = json.dumps(resultado, ensure_ascii=False, indent=2, sort_keys=False)
    return Response(json_data, mimetype="application/json; charset=utf-8")


@bp.route("/criarreserva", methods=["POST"])
def criar_reserva():
    data = request.get_json()
    id = data["apartment_id"]
    apartamento = Apartment.query.get(id)
    
    try:
        guests = int(data["guests"])
        if guests > apartamento.max_guests:
            return Response(
                json.dumps(
                    {
                        "erro": f"O número máximo de hóspedes permitido é {apartamento.max_guests}"
                    }
                ),
                status=400,
                mimetype="application/json",
            )
        
        reservas_conflitantes = Reservation.query.filter(
             Reservation.apartment_id == id,
             Reservation.checkout_date >= data['checkout'],  
             Reservation.checkin_date <= data['checkin'],
         ).all()

        if reservas_conflitantes:
             return Response(
                 json.dumps({"erro": "Já existe uma reserva para este apartamento no período informado." }),
                 status=400,
                 mimetype="application/json",
             )
        
        nova_reserva = Reservation(
            apartment_id=id,
            contact_id=data["contact_id"],
            checkin_date=data['checkin'],
            checkout_date=data['checkout'],
            guests=data['guests'],
            channel=data["channel"],
            total_price=data["total_price"],
        )

        db.session.add(nova_reserva)
        db.session.commit()

        msg = {"mensagem": "Reserva criada com sucesso!"}
        return (
            Response(
                json.dumps(msg, ensure_ascii=False),
                content_type="application/json; charset=utf-8",
            ),
            201,
        )

    except Exception as e:
        print(f"Erro ao criar reserva: {e}")
        msg = {"erro": "Erro ao criar reserva"}
        return (
            Response(
                json.dumps(msg, ensure_ascii=False),
                content_type="application/json; charset=utf-8",
            ),
            500,
        )
        
@bp.route("/filtro",methods = ["GET"])
def filtro():

        cidade = request.args.get("cidade", type=str)
        inicio = request.args.get("inicio", type=str)
        fim = request.args.get("fim", type=str)
        
        print(cidade)
        
        query = Reservation.query.join(Apartment)
        
        if cidade:
            query = query.filter(Apartment.city.ilike(f"%{cidade}%"))
            
        if inicio and fim:
            query = query.filter(
                Reservation.checkout_date >= inicio,
                Reservation.checkin_date <= fim,
            )
            
        reservas = query.all()
        
        resultado = []
        
        for r in reservas:
            resultado.append({
            "apartment": {
                    "id": r.apartment.id,
                    "title": r.apartment.title,
                    "city": r.apartment.city,
                    "state": r.apartment.state,
                    "max_guests": r.apartment.max_guests,
                    "daily_rate": r.apartment.daily_rate,
                },
            "contact": {
                    "id": r.contact.id,
                    "name": r.contact.name,
                    "email": r.contact.email,
                    "phone": r.contact.phone,
                    "type": r.contact.type,
                    "document": r.contact.document,
                },
            "reserva": {
                "id": r.id,
                "checkin": r.checkin_date.isoformat(),
                "checkout": r.checkout_date.isoformat(),
                "guests": r.guests,
                "total_price": float(r.total_price),
                "channel": r.channel,
                },
            }
            )
        json_data = json.dumps(resultado, ensure_ascii=False, indent=2, sort_keys=False)
        return Response(json_data, mimetype="application/json; charset=utf-8")


@bp.route("/filtro_sem_reserva", methods=["GET"])
def filtro_sem_reserva():
    cidade = request.args.get("cidade", type=str)
    inicio = request.args.get("inicio", type=str)
    fim = request.args.get("fim", type=str)

    query = Apartment.query

    if cidade:
        query = query.filter(Apartment.city.ilike(f"%{cidade}%"))

    if inicio and fim:
        subquery = (
            db.session.query(Reservation.apartment_id)
            .filter(
                Reservation.checkout_date > inicio,
                Reservation.checkin_date < fim
            )
            .subquery()
        )

        query = query.filter(~Apartment.id.in_(subquery))

    apartamentos_disponiveis = query.all()

    resultado = []
    for apt in apartamentos_disponiveis:
        resultado.append({
            "apartment": {
                "id": apt.id,
                "title": apt.title,
                "city": apt.city,
                "state": apt.state,
                "max_guests": apt.max_guests,
                "daily_rate": apt.daily_rate,
            }
        })

    json_data = json.dumps(resultado, ensure_ascii=False, indent=2, sort_keys=False)
    return Response(json_data, mimetype="application/json; charset=utf-8")



    
@bp.route("/dashboard", methods = ["GET"])
def dashboard():
    
    hoje = datetime.utcnow()
    # print(hoje) #debug
    ultimo_mes = hoje - timedelta(days=30)
    informacao = Reservation.query.filter(Reservation.checkin_date >= ultimo_mes).all()
    total = [0,0,0,0]
    
    cidades_resultado = (
        db.session.query(Apartment.city, func.count(Reservation.id).label("total_reservas"))
        .join(Apartment, Reservation.apartment_id == Apartment.id)
        .filter(Reservation.checkin_date >= ultimo_mes)
        .group_by(Apartment.city)
        .order_by(func.count(Reservation.id).desc())
        .all()
    )

    cidades = [{"cidade": cidade, "total_reservas": total} for cidade, total in cidades_resultado]
    # print(cidades) debug

    for r in informacao:
       total[0] += 1
       
       if r.channel == ("airbnb"):
           total[1] += r.total_price
       elif r.channel == ("booking.com"):
           total[2] += r.total_price
       else:
           total[3] += r.total_price
    
    resultado = []
    
    resultado.append(
        {
        "Informações" : {
            "total_reserva": total[0],
            "total_price_airbnb":total[1],
            "total_price_booking":total[2],
            "total_price_direto":total[3],
            "cidades_mais_reservas": cidades
            
        }
        }  
    )
    json_data = json.dumps(resultado, ensure_ascii=False, indent=2, sort_keys=False)
    return Response(json_data, mimetype="application/json; charset=utf-8")
    
    
@bp.route("/cadastro", methods=["POST"])
def cadastro():
    data = request.get_json()
    print("Dados recebidos:", data)

    try:

        novo_contato = Contact(
            name=data["name"],
            email=data["email"],
            phone=data["phone"],
            type=data["type"],
            document=data["document"]
        )
        db.session.add(novo_contato)
        db.session.flush()  
        
        senha_bytes = data["senha"].encode('utf-8')
        hashed_senha = bcrypt.hashpw(senha_bytes, bcrypt.gensalt())

        nova_cadastro = Login(
            email=data["email"],
            senha=hashed_senha.decode('utf-8'),
            contact_id=novo_contato.id
        )
        db.session.add(nova_cadastro)

        db.session.commit()

        msg = {"mensagem": "Cadastro criado com sucesso!"}
        return (
            Response(
                json.dumps(msg, ensure_ascii=False),
                content_type="application/json; charset=utf-8",
            ),
            201
        )

    except Exception as e:
        db.session.rollback()
        
        if 'contacts_document_key' in str(e):
            erro_msg = "Documento já cadastrado. Por favor, use outro."
        elif 'contacts_email_key' in str(e):
            erro_msg = "E-mail já cadastrado. Tente recuperar sua conta."
        else:
            erro_msg = "Erro ao criar o cadastro"
        print(f"Erro ao criar reserva: {e}")
        msg = {"erro": erro_msg}
        return (
            Response(
                json.dumps(msg, ensure_ascii=False),
                content_type="application/json; charset=utf-8",
            ),
            400
        )
        
@bp.route("/login", methods=["GET"])
def login():
    email = request.args.get("email", type=str)
    senha = request.args.get("senha", type=str)
    
    if email == "admin" and senha == "admin":
       
        return {
        "mensagem": "Login admin realizado com sucesso!",
        "redirect": "http://localhost:3000/dashboard"
    }, 200

    try:
        usuario = Login.query.filter_by(email=email).first()

        if not usuario:
            raise Exception("Usuário não encontrado.")

        senha_correta = bcrypt.checkpw(senha.encode("utf-8"), usuario.senha.encode("utf-8"))

        if senha_correta:
            msg = {"mensagem": "Login realizado com sucesso!"}
            return Response(
                json.dumps(msg, ensure_ascii=False),
                content_type="application/json; charset=utf-8",
            ), 200
        else:
            raise Exception("Senha incorreta.")

    except Exception as e:
        msg = {"mensagem": str(e) or "Login ou senha incorreto"}
        return Response(
            json.dumps(msg, ensure_ascii=False),
            content_type="application/json; charset=utf-8",
        ), 400
