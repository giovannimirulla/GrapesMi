-- Eliminazione database se esiste
drop database if exists esameDatabase;

-- Creazione database

create database esameDatabase;
use esameDatabase;

-- Creazione tabella ANAGRAFICA_ACCOUNT, ACCOUNT e inserimento dei dati 

create table ANAGRAFICA_ACCOUNT(
ID integer auto_increment primary key,
Nome varchar(255),
Cognome varchar(255),
DataDiNascita date
)engine="InnoDB";

create table ACCOUNT(
ID integer auto_increment primary key,
Email varchar(255) not null,
Username varchar(255) not null unique,
Password varchar(255) not null,
Propic varchar(255) default null,
Tipo integer default 0,
MaxDispositivi integer default 0,
NumeroDispositiviRegistrati integer default 0,
AutomaticDeployment boolean default 1,

index idx_ID(ID),

foreign key (ID) references ANAGRAFICA_ACCOUNT(ID)
)engine="InnoDB";


-- Allineo attributo ridondante MaxDispositivi - Utilizzo del case
delimiter //
create trigger aggiornaMaxDispositivi
before insert on ACCOUNT
for each row
begin
set NEW.MaxDispositivi = (
case NEW.Tipo
when 0 then 10
when 1 then 20 
when 2 then 50
else 0
end
);
end //
delimiter ;

-- Controllo sull'attributo disribuzione automatica
delimiter //
create trigger aggiornaAutomaticDeployment
before insert on ACCOUNT
for each row
begin
if (NEW.AutomaticDeployment = True) then 
set NEW.AutomaticDeployment = (
case NEW.Tipo
when 2 then True
else False
end);
end if;
end //
delimiter ;


-- Iscrizione account - Utilizzo del case e scrittura considerando un attributo ridodante
delimiter //
create procedure registraAccount(in email varchar(255), in username varchar(255), in password varchar(255), in propic varchar(255), in nome varchar(255), in cognome varchar(255), in DataDiNascita date, in tipo integer)
begin
if exists (select * from ACCOUNT A where A.Email = email) then
SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Errore: Account presente";
else 
insert into ANAGRAFICA_ACCOUNT (Nome, Cognome, DataDiNascita)  value (nome, cognome, DataDiNascita);
insert into ACCOUNT (Email, Username , Password,Propic, Tipo) value (email, username, password, propic, tipo);
end if;
end //
delimiter ;

call registraAccount("mirullagiovanni@gmail.com", "giovannimirulla", "$2y$10$dJ8wfAPpZzj6VCmjj3svB.fhZhDN6SVkA9reV8eY0OgbEEplY8uNm",NULL, 'Giovanni','Mirulla','1998/11/21', 2);
call registraAccount("palermo.danilo23@gmail.com","dimir22", "$2y$12$yncaoEn7CCDkNvvnFs3YTesF03Hca9/WYlbnVRt/u/SV9pmD/oX.a",NULL, 'Dany','Palermo','1997/03/23', 0);
call registraAccount("domhardy@virgilio.it", "domhardy", "$2y$12$yncaoEn7CCDkNvvnFs3YTesF03Hca9/WYlbnVRt/u/SV9pmD/oX.a",NULL, 'Domenico','Ardito','1958/12/25', 1);
call registraAccount("agatarosselli@gmail.com", "agata", "$2y$12$yncaoEn7CCDkNvvnFs3YTesF03Hca9/WYlbnVRt/u/SV9pmD/oX.a",NULL, 'Agata','Rosselli','1999/06/06', 0);
call registraAccount("adriana.scuderi@live.it","haloo", "$2y$12$yncaoEn7CCDkNvvnFs3YTesF03Hca9/WYlbnVRt/u/SV9pmD/oX.a",NULL, 'Adriana','Scuderi','1999/11/24', 1);
call registraAccount("igormiti@virgilio.it","igor", "$2y$12$yncaoEn7CCDkNvvnFs3YTesF03Hca9/WYlbnVRt/u/SV9pmD/oX.a",NULL, 'Igor','Miti','1970/04/20', 2);
call registraAccount("timcook@apple.com","iphone40", "$2y$12$yncaoEn7CCDkNvvnFs3YTesF03Hca9/WYlbnVRt/u/SV9pmD/oX.a",NULL,'Tim','Cook','1960/11/01', 0);
call registraAccount("edimondolamrca@hotmail.it","edimondo","$2y$12$yncaoEn7CCDkNvvnFs3YTesF03Hca9/WYlbnVRt/u/SV9pmD/oX.a",NULL,'Edimondo','Lamarca','1976/11/20', 1);
call registraAccount("billgates@microsoft.com","nietealimenti","$2y$12$yncaoEn7CCDkNvvnFs3YTesF03Hca9/WYlbnVRt/u/SV9pmD/oX.a",NULL,'Bill','Gates','1955/10/28', 2);
call registraAccount("markzuckerberg@facebook.com","markzuckerberg","$2y$12$yncaoEn7CCDkNvvnFs3YTesF03Hca9/WYlbnVRt/u/SV9pmD/oX.a",NULL,'Mark','Zuckerberg','1984/05/14', 0);
 
    
-- Creazione tabella SCHEDA e inserimento dei dati 
 
create table SCHEDA(
NumeroModello integer auto_increment primary key,
Nome varchar(255) not null,
Versione integer default 1,
Immagine varchar(255) not null
)engine="InnoDB";

INSERT INTO SCHEDA (`Nome`, Versione, `Immagine`)
VALUES
 ('Raspberry Pi', 4, 'https://raw.githubusercontent.com/giovannimirulla/mhw2/main/img/sbc/raspberrypi4.png'),
 ('Banana Pi', 1, 'https://raw.githubusercontent.com/giovannimirulla/mhw2/main/img/sbc/bananapi.png'),
 ('BeagleBone Black', 1, 'https://raw.githubusercontent.com/giovannimirulla/mhw2/main/img/sbc/bbb.png'),
 ('ODROID', 1, 'https://raw.githubusercontent.com/giovannimirulla/mhw2/main/img/sbc/odroidn2.png'),
 ('Orange Pi', 4, 'https://raw.githubusercontent.com/giovannimirulla/mhw2/main/img/sbc/orangepi.png'),
 ('Raspberry Pi', 3, 'https://raw.githubusercontent.com/giovannimirulla/mhw2/main/img/sbc/raspberrypi3.png');

-- Creazione tabella DATI_SCHEDA e inserimento dei dati
 
create table DATI_SCHEDA(
NumeroModello integer primary key,
CPU varchar(255),
GPU varchar(255),
RAM varchar(255),
Storage varchar(255),
WiFi varchar(255),
Bluetooth varchar(255),
foreign key (NumeroModello) references SCHEDA(NumeroModello)
)engine="InnoDB";

INSERT INTO DATI_SCHEDA (`NumeroModello`, CPU, GPU, RAM, Storage, WiFi, `Bluetooth`) VALUES
(1, '4× Cortex-A72 1.5 GHz', 'Broadcom VideoCore VI - 500 MHz', '1, 2, 4 or 8 GB', 'MicroSDHC', '802.11b/g/ndual band 2.4/5 GHz', '5.0'),
(2,  'ARM Cortex-A7 Octa-Core 1.8 GHz', 'PowerVR SGX544MP1', '2 GB', '8GB eMMC', '802.11b/g/n single-band radio', '4.0'),
(3,  'Cortex-A8 + Dual PRU (200 MHz)', 'PowerVR SGX530 - 200 MHz', '512 MB', '8GB eMMC', 'None', 'None'),
(4,  'Amlogic S922X Processor', 'Mali-G52 - 846Mhz', '4GB or 2GB', '8GB-128GB eMMC/microSD', 'None', 'None'),
(5,  'ARM® Cortex™-A7 Dual-Core', 'ARM® Mali400MP2', '1GB', 'TF slot', '802.11b/g/n single-band radio', 'None'),
(6,  '4× Cortex-A53 1.4 GHz', 'Broadcom VideoCore IV - 400 MHz', '1 GB', 'MicroSDHC', '802.11b/g/n single band 2.4 GHz', '4.1 BLE');

-- Creazione tabella SO e inserimento dei dati 
  
create table SO(
ID integer auto_increment primary key,
Nome varchar(255) not null,
Icona varchar(255) not null
)engine="InnoDB";

INSERT INTO SO (`Nome`,`Icona`)
VALUES
 ("Debian", "https://img.shields.io/badge/%20-%23{background}.svg?&logo=debian&logoColor=A81D33&style=flat-square"),
    ("Raspbian", "https://img.shields.io/badge/%20-%23{background}.svg?&logo=raspberry%20pi&logoColor=A22846&style=flat-square"),
    ("Ubuntu", "https://img.shields.io/badge/%20-%23{background}.svg?&logo=ubuntu&logoColor=E95420&style=flat-square"),
    ("Android", "https://img.shields.io/badge/%20-%23{background}.svg?&logo=android&logoColor=3DDC84&style=flat-square"),
    ("Windows", "https://img.shields.io/badge/%20-%23{background}.svg?&logo=windows&logoColor=0078D6&style=flat-square"),
    ("Lubuntu", "https://img.shields.io/badge/%20-%23{background}.svg?&logo=lubuntu&logoColor=0068C8&style=flat-square"),
    ("Fedora", "https://img.shields.io/badge/%20-%23{background}.svg?&logo=fedora&logoColor=294172&style=flat-square"),
    ("openSUSE", "https://img.shields.io/badge/%20-%23{background}.svg?&logo=opensuse&logoColor=73BA25&style=flat-square");

-- Creazione tabella COMPATIBILITA e inserimento dei dati 
 
create table COMPATIBILITA(
NumeroModelloScheda integer,
IDSO integer,

foreign key (NumeroModelloScheda) references SCHEDA(NumeroModello),
foreign key (IDSO) references SO(ID),

primary key (NumeroModelloScheda, IDSO)
)engine="InnoDB"; 

INSERT INTO COMPATIBILITA (`NumeroModelloScheda`, `IDSO`)
VALUES
 (1,2),
 (1,3),
 (1,4),
 (1,5),
 (2,2),
 (3,2), 
 (3,4),
 (3,5),
 (4,1),
 (4,2),
 (4,4),
 (4,5),
 (5,1),
 (5,2),
 (6,2),
 (6,3),
 (6,4),
 (6,5);
 

-- Creazione tabella PROGETTO e inserimento dei dati 

create table PROGETTO(
ID integer auto_increment primary key,
Nome varchar(255) unique not null,
Descrizione varchar(255) not null,
Logo varchar(255) not null,
DataAvvioProgetto date default current_date,
DataUltimoAggiornamento date default current_date
)engine="InnoDB";

INSERT INTO PROGETTO (`Nome`, Descrizione, Logo,DataAvvioProgetto, `DataUltimoAggiornamento`)
VALUES

('AIrrowy', 'Artificial Intelligence on directional indicator', 'http://localhost/mhw3/img/projects/AIrrowy.png', '2017-11-21', '2018-11-21'),
('OpenHAB', 'Empowering the smart home', 'http://localhost/mhw3/img/projects/openHAB.png', '2014-11-23', '2020-11-23'),
('HomeBridge', 'HomeKit support for the impatient', 'http://localhost/mhw3/img/projects/homebridge.png', '2017-06-02', '2020-09-11'),
('SmartShoes', 'Wear the IoT world', 'http://localhost/mhw3/img/projects/smartShoes.png', '2017-06-02', '2020-09-11'),
('DomIoT', 'The Internet of Things at the palm of your hands', 'http://localhost/mhw3/img/projects/domiot.png', '2020-09-01', '2020-12-01'),
('PluvIoT', 'The smart weather station', 'http://localhost/mhw3/img/projects/pluviot.png', '2020-06-01', '2020-12-11');

-- Creazione tabella SO_COMPILATO 

create table SO_COMPILATO(
IDSOCompilato integer auto_increment primary key,
IDSO integer,
Versione integer default 1,
IDProgetto integer,
DataRilascio date default current_date,

index idx_IDSO(IDSO),
index idx_IDProgetto(IDProgetto),

foreign key (IDSO) references SO(ID),
foreign key (IDProgetto) references PROGETTO(ID),

unique(Versione,IDSO,IDProgetto)
)engine="InnoDB";


-- Creazione tabella DISPOSITIVO

create table DISPOSITIVO(
Seriale integer not null,
NumeroModello integer,
FineSupporto date,

index idx_NumeroModello(NumeroModello),

foreign key (NumeroModello) references SCHEDA(NumeroModello),

primary key (Seriale,NumeroModello)
)engine="InnoDB";


-- Creazione tabella INSTALLAZIONE

create table INSTALLAZIONE_OTA(
SerialeDispositivo integer,
NumeroModelloDispositivo integer,
IDSOCompilato integer,
DataAvvenutoAggiornamento datetime default now(),
DataUltimoSupporto datetime default null,
Corrente boolean default 1,

index idx_SerialeDispositivo(SerialeDispositivo),
index idx_NumeroModelloDispositivo(NumeroModelloDispositivo),
index idx_IDSOCompilato(IDSOCompilato),

foreign key (SerialeDispositivo, NumeroModelloDispositivo) references DISPOSITIVO(Seriale, NumeroModello),
foreign key (IDSOCompilato) references SO_COMPILATO(IDSOCompilato),

primary key (SerialeDispositivo, NumeroModelloDispositivo, IDSOCompilato, DataAvvenutoAggiornamento)
)engine="InnoDB";


-- Creazione tabella REGISTRAZIONE

create table REGISTRAZIONE(
IDAccount integer,
SerialeDispositivo integer,
NumeroModelloDispositivo integer,
IDProgetto integer,

index idx_IDAccount(IDAccount),
index idx_SerialeDispositivoo(SerialeDispositivo),
index idx_NumeroModelloDispositivo(NumeroModelloDispositivo),
index idx_IDProgetto(IDProgetto),

foreign key (IDAccount) references ACCOUNT(ID),
foreign key (SerialeDispositivo, NumeroModelloDispositivo) references DISPOSITIVO(Seriale, NumeroModello),
foreign key (IDProgetto) references PROGETTO(ID),

primary key(IDAccount, SerialeDispositivo, NumeroModelloDispositivo, IDProgetto)
)engine="InnoDB";


-- Business Rule: verifica che non vengano inseriti più dispositivi previsti sul piano 
delimiter //
create trigger controllaNumeroDispositivi
before insert on REGISTRAZIONE
for each row 
begin 
if exists(select * from ACCOUNT A where A.`ID` = NEW.IDAccount and A.`MaxDispositivi` <= (select count(distinct R.`SerialeDispositivo`, R.`NumeroModelloDispositivo`) from REGISTRAZIONE R where R.`IDAccount` = NEW.IDAccount ))
then 
delete from DISPOSITIVO  where Seriale = NEW.SerialeDispositivo and NumeroModello = NEW.NumeroModelloDispositivo;
SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Errore: Hai raggiunto il limite massimo di dispositivi";
end if;
end //
delimiter ;


-- Allinea attributo ridondande NumeroDispositiviRegistrati
delimiter //
create trigger aggiornaNumeroDispositiviRegistrati
after insert on REGISTRAZIONE
for each row
begin
if exists(select * from ACCOUNT A where A.`ID` = NEW.IDAccount) then
update ACCOUNT set NumeroDispositiviRegistrati = (select count(*) from REGISTRAZIONE R where R.`IDAccount` = NEW.IDAccount) where ID = NEW.IDAccount;
end if;
end //
delimiter ;


-- Creazione tabella COLLABORAZIONE

create table COLLABORAZIONE(
IDAccount integer,
IDProgetto integer,

index idx_IDAccount(IDAccount),
index idx_IDProgetto(IDProgetto),

foreign key (IDAccount) references ACCOUNT(ID),
foreign key (IDProgetto) references PROGETTO(ID),

primary key(IDAccount, IDProgetto)
)engine="InnoDB";


-- Procedura di registrazione al proget

to se presente o del progetto e primo dispositivo
delimiter //
create procedure registraDispositivo (in nomeProgetto varchar(255), in email varchar(255), in numeroModello integer, in seriale integer)
begin
start transaction;
-- Controlla che sia presente l'account
if exists(select * from ACCOUNT A where A.`Email` = email) then 
-- Controlla se esiste il progetto, altrimenti lo crea
if not exists(select * from PROGETTO P where P.`Nome` = nomeProgetto) then 
insert into PROGETTO (`Nome`) value (nomeProgetto);
end if;
-- Se il dispositivo non è presente
if not exists(select * from DISPOSITIVO D where D.`Seriale` = seriale and D.`NumeroModello` = numeroModello) then
-- Inserimento dispositivo
insert into DISPOSITIVO (`Seriale`,`NumeroModello`) value (seriale, numeroModello);
-- Effettua la registrazione
set @IDAccount = 0;
select A.`ID` into @IDAccount from ACCOUNT A where A.`Email` = email;
insert into REGISTRAZIONE (`IDProgetto`, IDAccount, SerialeDispositivo, `NumeroModelloDispositivo`) 
select P.`ID`, @IDAccount, seriale, numeroModello from PROGETTO P where P.`Nome` = nomeProgetto;
-- Inserisce la collaborazione al progetto se non è presente
if not exists (select * from COLLABORAZIONE C where C.`IDAccount` = @IDAccount and C.`IDProgetto` = (select P.`ID` from PROGETTO P where P.`Nome` = nomeProgetto)) then
insert into COLLABORAZIONE (`IDAccount`, IDProgetto`) select @IDAccount, P.`ID from PROGETTO P where P.`Nome` = nomeProgetto;
end if;
commit;
-- Altrimenti il progetto non può essere registrato
else 
rollback;
SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Errore: Non è possibile registrare il progetto";
end if;
else 
rollback;
-- Controlla che sia presente l'account
SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Errore: Non sei registrato";
end if;
end //
delimiter ;

delimiter //
create procedure toogleCollaborazione(in nomeProgetto varchar(255), in userID integer)
begin
if not exists (select * from COLLABORAZIONE C where C.`IDAccount` = userID and C.`IDProgetto` = (select P.`ID` from PROGETTO P where P.`Nome` = nomeProgetto)) then
insert into COLLABORAZIONE (`IDAccount`, IDProgetto`) select userID, P.`ID from PROGETTO P where P.`Nome` = nomeProgetto;
else
delete from COLLABORAZIONE where IDAccount = userID and IDProgetto = (select P.`ID` from PROGETTO P where P.`Nome` = nomeProgetto);
end if;
end //
delimiter ;

-- Chiamata alla procedura registraProgetto (Nome progetto, Email account, Modello dispositivo, Seriale dispositivo) 
call registraDispositivo("AIrrowy", "mirullagiovanni@gmail.com", 1,1);
call registraDispositivo("AIrrowy", "mirullagiovanni@gmail.com", 1,5);
call registraDispositivo("AIrrowy", "domhardy@virgilio.it", 2,1);
call registraDispositivo("OpenHAB", "mirullagiovanni@gmail.com", 3,1);
call registraDispositivo("OpenHAB", "billgates@microsoft.com", 1,2);
call registraDispositivo("OpenHAB", "agatarosselli@gmail.com", 1,3);
call registraDispositivo("HomeBridge", "igormiti@virgilio.it", 6,1);
call registraDispositivo("HomeBridge", "timcook@apple.com", 5,1);
call registraDispositivo("DomIoT", "markzuckerberg@facebook.com", 4,1);
call registraDispositivo("DomIoT", "domhardy@virgilio.it", 3,2);
call registraDispositivo("PluvIoT", "palermo.danilo23@gmail.com", 5,2);


-- Trigger per allineare versione del SO compilato
delimiter //
create trigger aggiornaVersione
before insert on SO_COMPILATO
for each row 
begin 
set NEW.`Versione` = (select count(S.`IDProgetto`)+1 from SO_COMPILATO S where S.`IDProgetto` = NEW.IDProgetto);
end //
delimiter ;

-- Creazione della vista storicoDispositivi
create view storicoDispositivi as
select IOTA.`SerialeDispositivo`, IOTA.`NumeroModelloDispositivo`, IOTA.`DataAvvenutoAggiornamento`, IOTA.`DataUltimoSupporto`, S.`IDSOCompilato`, IOTA.`Corrente`,  S.`Versione`, SO.`ID` as IDSO, SO.`Nome` as NomeSO, P.`ID` as IDProgetto, P.`Nome` as NomeProgetto from INSTALLAZIONE_OTA IOTA join SO_COMPILATO S on IOTA.`IDSOCompilato` = S.`IDSOCompilato` join SO SO on S.`IDSO` = SO.`ID` join PROGETTO P on S.`IDProgetto` = P.`ID`;





-- Account con più di una certa soglia dispositivi registrati - Lettura su attributo ridondante NumeroDispositiviRegistrati
delimiter //
create procedure accountConDispositiviSuperioriA(in numero integer)
begin 
drop temporary table if exists temp; 
create temporary table temp(
Email varchar(255),
MaxDispositivi integer,
NumeroDispositiviRegistrati integer
);
insert into temp
select A.`Email`, A.`MaxDispositivi`, A.`NumeroDispositiviRegistrati` from ACCOUNT A where A.`NumeroDispositiviRegistrati` > numero;
select * from temp;
end //
delimiter ;

call accountConDispositiviSuperioriA(0);

-- Numero account per tipo - Utillizzo del group by in lettura di un attributo sull'entità figlia
delimiter //
create procedure numeroAccountPerTipoSenzaDistrubuzione()
begin
drop temporary table if exists temp; 
create temporary table temp(
TipoAccount integer,
NumeroAccountRegistrati integer
);
insert into temp
select A.`Tipo`, count(distinct A.`Email`) from ACCOUNT A where A.`AutomaticDeployment` = False group by A.`Tipo`;
select * from temp;
end //
delimiter ;

call numeroAccountPerTipoSenzaDistrubuzione();

delimiter //
create procedure progettiPerScheda(in scheda varchar(255))
begin
drop table if exists temp;
create temporary table temp(
NomeProgetto varchar(255)
);
insert into temp
select sto.`NomeProgetto` from storicodispositivi sto join SCHEDA S on sto.`NumeroModelloDispositivo` = S.`NumeroModello` where S.Nome = scheda;
select * from temp;
end //
delimiter ;

call progettiPerScheda("Raspberry Pi");

-- Procedura per avviare installazione ota
delimiter //
create procedure aggiornaDispositivi(in nomeProgetto varchar(255), in nomeSO varchar(255))
begin 
start transaction;

if exists (select * from PROGETTO P where P.Nome = nomeProgetto) and exists (select * from SO S where S.Nome = nomeSO) then

-- update storicodispositivi set DataUltimoSupporto = NOW() , Corrente = 0 where NomeSO = nomeSO and NomeProgetto = nomeProgetto and Corrente = 1;

SET SQL_SAFE_UPDATES=0;
update INSTALLAZIONE_OTA IOTA join SO_COMPILATO SS on IOTA.IDSOCompilato = SS.IDSOCompilato join PROGETTO P on SS.IDProgetto = P.ID join SO S on SS.IDSO = S.ID set IOTA.DataUltimoSupporto = NOW(), IOTA.Corrente = 0 where S.Nome = nomeSO and P.Nome = nomeProgetto and IOTA.Corrente = 1;
SET SQL_SAFE_UPDATES=1;

insert into SO_COMPILATO (IDSO, IDProgetto) 
select S.ID, P.ID from SO S, PROGETTO P where S.Nome = nomeSO and P.Nome = nomeProgetto;

insert into INSTALLAZIONE_OTA (SerialeDispositivo, NumeroModelloDispositivo, IDSOCompilato) 
select R.SerialeDispositivo, R.NumeroModelloDispositivo, LAST_INSERT_ID() from REGISTRAZIONE R join PROGETTO P on R.IDProgetto = P.ID join COMPATIBILITA C on R.NumeroModelloDispositivo = C.NumeroModelloScheda join SO SO on C.IDSO = SO.ID  where P.Nome = nomeProgetto and SO.Nome =  nomeSO;

commit;
else rollback;
end if;
end //
delimiter ;

-- Percentuale dei dispositivi aggiornati - utilizzo della vista e storicizzazione
delimiter //
create procedure percentualeDispositiviAggiornati(out percetuale float, in nomeProgetto varchar(255), in nomeScheda varchar(255), in nomeSO varchar(255), in anni integer)
begin
set @numDispositiviAggiornati = 0;
set @numDispositivi = 0;

if (nomeScheda IS NULL) then
select count(distinct sto.SerialeDispositivo, sto.NumeroModelloDispositivo) into @numDispositivi from storicodispositivi sto where sto.NomeProgetto = nomeProgetto;
select count(distinct sto.SerialeDispositivo, sto.NumeroModelloDispositivo) into @numDispositiviAggiornati from storicodispositivi sto join SCHEDA S on sto.NumeroModelloDispositivo = S.NumeroModello where  sto.NomeProgetto = nomeProgetto and exists(select * from storicodispositivi sto1 where sto.IDProgetto = sto1.IDProgetto and sto.Corrente <> sto1.Corrente and sto.Versione > sto1.Versione) ;
elseif (nomeSO  IS NULL) then
select count(distinct sto.SerialeDispositivo, sto.NumeroModelloDispositivo) into @numDispositivi from storicodispositivi sto join SCHEDA S on sto.NumeroModelloDispositivo = S.NumeroModello where sto.NomeProgetto = nomeProgetto and S.Nome = nomeScheda;
select count(distinct sto.SerialeDispositivo, sto.NumeroModelloDispositivo) into @numDispositiviAggiornati from storicodispositivi sto join SCHEDA S on sto.NumeroModelloDispositivo = S.NumeroModello where  sto.NomeProgetto = nomeProgetto and S.Nome = nomeScheda and exists(select * from storicodispositivi sto1 where sto.IDProgetto = sto1.IDProgetto and sto.Corrente <> sto1.Corrente and sto.Versione > sto1.Versione) ;
elseif (anni IS NULL) then
select count(distinct sto.SerialeDispositivo, sto.NumeroModelloDispositivo) into @numDispositivi from storicodispositivi sto join SCHEDA S on sto.NumeroModelloDispositivo = S.NumeroModello where sto.NomeProgetto = nomeProgetto and S.Nome = nomeScheda and sto.NomeSO = nomeSO;
select count(distinct sto.SerialeDispositivo, sto.NumeroModelloDispositivo) into @numDispositiviAggiornati from storicodispositivi sto join SCHEDA S on sto.NumeroModelloDispositivo = S.NumeroModello where sto.NomeSO = nomeSO and sto.NomeProgetto = nomeProgetto and S.Nome = nomeScheda and exists(select * from storicodispositivi sto1 where sto.IDProgetto = sto1.IDProgetto and sto.Corrente <> sto1.Corrente and sto.Versione > sto1.Versione) ;
else
select count(distinct sto.SerialeDispositivo, sto.NumeroModelloDispositivo) into @numDispositivi from storicodispositivi sto join SCHEDA S on sto.NumeroModelloDispositivo = S.NumeroModello where sto.NomeProgetto = nomeProgetto and S.Nome = nomeScheda and sto.NomeSO = nomeSO;
drop temporary table temp;
create temporary table temp(
Seriale integer,
Modello integer,
DataAvvenutoAggiornamento datetime
);
insert into temp
select sto.SerialeDispositivo, sto.NumeroModelloDispositivo, sto.DataAvvenutoAggiornamento from storicodispositivi sto join SCHEDA S on sto.NumeroModelloDispositivo = S.NumeroModello where sto.NomeSO = nomeSO and sto.NomeProgetto = nomeProgetto and S.Nome = nomeScheda and exists(select * from storicodispositivi sto1 where sto.IDProgetto = sto1.IDProgetto and sto.Corrente <> sto1.Corrente and sto.Versione > sto1.Versione) having timestampdiff(year,sto.DataAvvenutoAggiornamento,CURRENT_DATE() )<anni;
select count(*) into @numDispositiviAggiornati from temp;
end if;


-- Calcola percentuale
if (select @numDispositiviAggiornati<>0) then
select @numDispositiviAggiornati*100/@numDispositivi into percetuale;
else 
SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Errore: Non sono stati aggiornati dispositivi";
end if;
end //
delimiter ;




set @percentuale = 0; 
call percentualeDispositiviAggiornati(@percentuale, "AIrrowy", "Raspberry Pi", "Debian", 1);
select @percentuale;

create view datiCollaborazioni as 
SELECT c.IDProgetto, A.Email, A.Username, A.Propic, AA.Nome, AA.Cognome FROM collaborazione c join account a on c.IDAccount = a.ID join anagrafica_account AA on AA.ID = a.ID;

create view schedePerProgetti as
select  s.*,  r.*, p.Nome as NomeProgetto, p.Logo as LogoProgetto, so.Nome as NomeSO, so.Icona as IconaSO, sto.Corrente, sto.Versione as VersioneSO
 from storicoDispositivi sto join registrazione r on sto.NumeroModelloDispositivo = r.NumeroModelloDispositivo 
 and sto.SerialeDispositivo = r.SerialeDispositivo join scheda s on  sto.NumeroModelloDispositivo = s.NumeroModello
 join SO so on sto.IDSO = so.ID join progetto p on sto.IDProgetto = p.ID where sto.Corrente in 
 (select max(sto1.corrente) from storicodispositivi sto1 where sto.NumeroModelloDispositivo = sto1.NumeroModelloDispositivo 
 and sto.SerialeDispositivo = sto1.SerialeDispositivo) group by r.SerialeDispositivo, r.NumeroModelloDispositivo

call aggiornaDispositivi("AIrrowy", "Raspbian");

create view dispositiviregistrati as
select a.Email, s.Nome as NomeDispositivo, s.Versione as VersioneDispositivo, s.Immagine as ImmagineDispositivo, p.Nome as NomeProgetto from Registrazione r join account a on r.IDAccount = A.ID join scheda s on r.NumeroModelloDispositivo = s.NumeroModello join progetto p on r.IDProgetto = p.ID