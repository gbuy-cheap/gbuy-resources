var languages = {
    ReviewSplitter: function (domain) {
        switch (domain) {
            case "com.tr":
            case "ca":
            case "co.uk":
            case "com":
                return " global";
            case "fr":
                return " commentaires";
            case "nl":
            case "de":
                return " globale";
            case "com.mx":
            case "es":
                return " reseñas globales";
            case "it":
                return " recensioni globali";
            case "se":
                return " globala";
            case "pl":
                return " globalne";
            default:
                return " global";
        }
    },
    DateFirstAvSplitter: function (domain) {
        switch (domain) {
            case "ca":
            case "co.uk":
            case "com":
                return "Date First Available";
            case "fr":
                return "Date de mise en ligne sur";
            case "nl":
                return "Datum eerste beschikbaarheid";
            case "de":
                return "Im Angebot von Amazon.de seit";
            case "com.mx":
            case "es":
                return "Producto en Amazon";
            case "it":
                return "Disponibile su Amazon";
            case "se":
                return "Första tillgängliga datum";
            case "pl":
                return "Data pierwszej dostępności";
            case "com.tr":
                return "Satışa Sunulduğu İlk Tarih";
            default:
                return "Date First Available";
        }
    },
    BSRSplitter: function (domain) {
        switch (domain) {
            case "ca":
            case "co.uk":
            case "com":
                return "ellers Rank";
            case "fr":
                return "Classement des meilleures ventes d";
            case "de":
                return "Amazon Bestseller-Rang";
            case "com.mx":
            case "es":
                return "Clasificación en los más vendidos de Amazon";
            case "it":
                return "Posizione nella classifica Bestseller di Amazon";
            case "com.tr":
                return "En Çok Satanlar Sıralaması";
            case "nl":
                return "Plaats ";
            case "se":
                return "Rangordning för bästsäljare";
            case "pl":
                return "Ranking najlep";
            default:
                return "ellers Rank";
        }
    },
    DimensionsSplitter: function (domain) {
        switch (domain) {
            case "ca":
            case "co.uk":
            case "com":
                return "Dimensions";
            case "fr":
                return "Dimensions";
            case "de":
                return "Produktabmessungen";
            case "com.mx":
            case "es":
                return "Dimensiones del producto";
            case "it":
                return "Dimensioni prodotto";
            case "com.tr":
                return "Ürün Boyutları";
            case "nl":
                return "fmetingen";
            case "se":
                return "Produktens mått";
            case "pl":
                return "Wymiary";
            default:
                return "Dimensions";
        }
    },
    ItemWeightSplitter: function (domain) {
        switch (domain) {
            case "ca":
            case "co.uk":
            case "com":
                return "Item Weight";
            case "fr":
                return "Poids du produit";
            case "de":
                return "Artikelgewicht";
            case "com.mx":
            case "es":
                return "Peso del producto";
            case "it":
                return "Peso articolo";
            case "com.tr":
                return "Ürün Ağırlığı";
            case "nl":
                return "Gewicht";
            case "se":
                return "Vikt";
            case "pl":
                return "Waga";
            default:
                return "Item Weight";
        }
    },
    ModelSplitter: function (domain) {
        switch (domain) {
            case "ca":
            case "co.uk":
            case "com":
                return "Item model number";
            case "fr":
                return "Numéro du modèle de";
            case "de":
                return "Modellnummer";
            case "com.mx":
            case "es":
                return "Número de modelo";
            case "it":
                return "Numero modello articolo";
            case "com.tr":
                return "Ürün Model Numarası";
            case "nl":
                return "Model";
            case "se":
                return "Artikelnummer";
            case "pl":
                return "modelu";
            default:
                return "Item model number";
        }
    },
    InSplitter: function (domain) {
        switch (domain) {
            case "com":
            case "it":
            case "ca":
            case "co.uk":
            case "de":
            case "nl":
                return " in ";
            case "com.mx":
            case "es":
            case "fr":
                return " en ";
            case "com.tr":
                return ". sırada: ";
            case "se":
                return " i ";
            case "pl":
                return " w kategorii ";
            default:
                return " in ";
        }
    },
    OnSplitter: function (domain) {
        switch (domain) {
            case "de":
                return " vom "
            case "ca":
            case "co.uk":
            case "com":
                return " on ";
            case "com.mx":
            case "es":
                return " el ";
            case "fr":
                return " le ";
            case "it":
                return " il ";
            case "nl":
                return " op ";
            case "se":
                return " den ";
            case "pl":
                return " dnia ";
            default:
                return " on ";
        }
    },
    BrandSplitter: function (domain) {
        switch (domain) {
            case "co.uk":
            case "ca":
            case "com":
                return "Brand";
            case "pl":
            case "com.tr":
                return "Marka";
            case "de":
                return "Marke";
            case "com.mx":
            case "es":
            case "it":
                return "Marca";
            case "fr":
                return "Marque";
            case "nl":
                return "Merk";
            case "se":
                return "Varumärke";
            default:
                return "Brand";
        }
    },
    ManuSplitter: function (domain) {
        switch (domain) {
            case "co.uk":
            case "ca":
            case "com":
                return "Manufacturer";
            case "com.tr":
                return "Üretici";
            case "it":
                return "Produttore";
            case "de":
                return "Hersteller";
            case "com.mx":
            case "es":
                return "Fabricante";
            case "fr":
                return "Fabricant";
            case "nl":
                return "Fabrikant";
            case "se":
                return "Tillverkare";
            case "pl":
                return "Producent";
            default:
                return "Manufacturer";
        }
    },
    TranslateDate: function (domain, date) {
        try {
            if (domain == "it") {
                return date.replace("gennaio", "January")
                    .replace("febbraio", "February")
                    .replace("marzo", "March")
                    .replace("aprile", "April")
                    .replace("maggio", "May")
                    .replace("giugno", "June")
                    .replace("luglio", "July")
                    .replace("agosto", "August")
                    .replace("settembre", "September")
                    .replace("ottobre", "October")
                    .replace("novembre", "November")
                    .replace("dicembre", "December");
            } else if (domain == "fr") {
                return date.replace("janvier", "January")
                    .replace("février", "February")
                    .replace("mars", "March")
                    .replace("avril", "April")
                    .replace("mai", "May")
                    .replace("juin", "June")
                    .replace("juillet", "July")
                    .replace("août", "August")
                    .replace("septembre", "September")
                    .replace("octobre", "October")
                    .replace("novembre", "November")
                    .replace("décembre", "December");
            } else if (domain == "de") {
                return date.replace("Januar", "January")
                    .replace("Februar", "February")
                    .replace("März", "March")
                    .replace("April", "April")
                    .replace("Mai", "May")
                    .replace("Juni", "June")
                    .replace("Juli", "July")
                    .replace("August", "August")
                    .replace("September", "September")
                    .replace("Oktober", "October")
                    .replace("November", "November")
                    .replace("Dezember", "December");
            } else if (domain == "es" || domain == "com.mx") {
                return date.replace("enero", "January")
                    .replace("febrero", "February")
                    .replace("marzo", "March")
                    .replace("abril", "April")
                    .replace("mayo", "May")
                    .replace("junio", "June")
                    .replace("julio", "July")
                    .replace("agosto", "August")
                    .replace("septiembre", "September")
                    .replace("octubre", "October")
                    .replace("noviembre", "November")
                    .replace("diciembre", "December").replaceAll(" de ", " ");
            } else if (domain == "nl") {
                return date.replace("januari", "January")
                    .replace("februari", "February")
                    .replace("maart", "March")
                    .replace("april", "April")
                    .replace("mei", "May")
                    .replace("juni", "June")
                    .replace("juli", "July")
                    .replace("augustus", "August")
                    .replace("september", "September")
                    .replace("oktober", "October")
                    .replace("november", "November")
                    .replace("december", "December");
            } else if (domain == "se") {
                return date.replace("januari", "January")
                    .replace("februari", "February")
                    .replace("mars", "March")
                    .replace("april", "April")
                    .replace("maj", "May")
                    .replace("juni", "June")
                    .replace("juli", "July")
                    .replace("augusti", "August")
                    .replace("september", "September")
                    .replace("oktober", "October")
                    .replace("november", "November")
                    .replace("december", "December");
            } else if (domain == "pl") {
                return date.replace("stycznia", "January")
                    .replace("lutowy", "February")
                    .replace("marca", "March")
                    .replace("kwietnia", "April")
                    .replace("maja", "May")
                    .replace("czerwca", "June")
                    .replace("lipca", "July")
                    .replace("sierpnia", "August")
                    .replace("września", "September")
                    .replace("października", "October")
                    .replace("listopada", "November")
                    .replace("grudnia", "December");
            } else if (domain == "com.tr") {
                return date.replace("Ocak", "January")
                    .replace("Şubat", "February")
                    .replace("Mart", "March")
                    .replace("Nisan", "April")
                    .replace("Mayıs", "May")
                    .replace("Haziran", "June")
                    .replace("Temmuz", "July")
                    .replace("Ağustos", "August")
                    .replace("Eylül", "September")
                    .replace("Ekim", "October")
                    .replace("Kasım", "November")
                    .replace("Aralık", "December");
            }

            return date;
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    }
}











