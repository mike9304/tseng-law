#!/usr/bin/env python3
import sys
sys.path.insert(0, "/Users/son7/Projects/tseng-law-fix-s-20260921/.tmp-es")
from apply import apply

D = "src/content/columns-es/"

# ---- 001 ----
apply(D + "001-taiwan-company-establishment-basics.md", [
    # a#33 English abbreviation PE out of running Spanish
    ("un establecimiento permanente (常設機構, PE) según el acuerdo",
     "un establecimiento permanente (常設機構) según el acuerdo"),
    # a#2 / R2b country-specific framing (English source has it; keep every digit)
    ("El Acuerdo de Impuesto sobre la Renta (所得稅協定) entre Taiwán y Corea entró en vigor el 27 de diciembre de 2023",
     "Nota específica de país — Acuerdo de Impuesto sobre la Renta entre Taiwán y Corea: el Acuerdo de Impuesto sobre la Renta (所得稅協定) entre Taiwán y Corea entró en vigor el 27 de diciembre de 2023"),
    ("no obstante, debe confirmarse primero la forma real de ejecución del negocio.\n",
     "no obstante, debe confirmarse primero la forma real de ejecución del negocio. Esta explicación del acuerdo se refiere a supuestos de hecho vinculados con Corea que cumplan sus requisitos: no es una regla aplicable a cualquier inversor extranjero. Si existe un acuerdo fiscal entre Taiwán y el país del propio inversor, y cuáles son sus términos, debe comprobarse por separado.\n"),
    # the later repetition of the agreement discussion gets the same caveat once
    ("El Acuerdo de Impuesto sobre la Renta entre Taiwán y Corea, que como se ha indicado solo se aplica a los casos que reúnen sus requisitos, entró en vigor",
     "El Acuerdo de Impuesto sobre la Renta entre Taiwán y Corea, que como se ha indicado solo se aplica a los supuestos de hecho vinculados con Corea que reúnen sus requisitos y no a cualquier inversor extranjero, entró en vigor"),
])

# ---- 004 ----
apply(D + "004-taiwan-company-subsidiary-vs-branch.md", [
    # a#33 English abbreviation
    ("## 6. El Acuerdo de Impuesto sobre la Renta entre Taiwán y Corea y el establecimiento permanente (PE)",
     "## 6. El Acuerdo de Impuesto sobre la Renta entre Taiwán y Corea y el establecimiento permanente (常設機構)"),
    ("un establecimiento permanente (常設機構, PE) según el acuerdo",
     "un establecimiento permanente (常設機構) según el acuerdo"),
    # a#4 / R2a: foreign parent is the default reader; Korea is a labelled example
    ("Aunque una sociedad matriz coreana entre en Taiwán, no debe verse solo el Derecho de Taiwán, sino también la contabilidad, la fiscalidad y el procedimiento de inversión en el exterior de Corea.",
     "Cuando una sociedad matriz establecida fuera de Taiwán entra en Taiwán, no debe verse solo el Derecho de Taiwán, sino también la contabilidad, la fiscalidad y el procedimiento de inversión en el exterior del país de origen. Corea es un ejemplo señalado más adelante, no el único país de origen posible."),
    # a#4 also: "En el lado de Corea" as the default home country
    ("En el lado de Corea deben confirmarse juntos el crédito por impuestos pagados en el extranjero (外國稅額扣抵), los dividendos de la filial en el exterior, los ingresos y pérdidas de la sucursal, el trato contable consolidado o separado y la declaración de divisas. Cómo se traten las pérdidas iniciales de la sucursal taiwanesa en relación con la sede puede variar según la ley tributaria y las normas contables de Corea. Por tanto, no puede concluirse de antemano que elegir la sucursal reduzca la carga fiscal de la sociedad matriz coreana.",
     "En el país de origen —Corea, en el ejemplo que sigue— deben confirmarse juntos el crédito por impuestos pagados en el extranjero (外國稅額扣抵), los dividendos de la filial en el exterior, los ingresos y pérdidas de la sucursal, el trato contable consolidado o separado y la declaración de divisas. Cómo se traten las pérdidas iniciales de la sucursal taiwanesa en relación con la sede puede variar según la ley tributaria y las normas contables de cada país. Por tanto, no puede concluirse de antemano que elegir la sucursal reduzca la carga fiscal de la sociedad matriz."),
    ("Conviene comparar en un mismo cuadro de cálculo la cuota en Taiwán, la carga final en Corea, el momento de recuperación de caja y el coste de la prueba.",
     "Conviene comparar en un mismo cuadro de cálculo la cuota en Taiwán, la carga final en el país de origen, el momento de recuperación de caja y el coste de la prueba."),
    ("- Cómo se gestionarán los libros, la auditoría, los documentos de precios de transferencia y la declaración y el crédito por impuestos pagados en el extranjero en el lado de Corea",
     "- Cómo se gestionarán los libros, la auditoría, los documentos de precios de transferencia y la declaración y el crédito por impuestos pagados en el extranjero en el país de origen"),
    # R2b framing for the agreement section
    ("El Acuerdo de Impuesto sobre la Renta entre Taiwán y Corea, que como se ha indicado solo se aplica a los casos que reúnen sus requisitos, se firmó el 17 de noviembre de 2021",
     "El Acuerdo de Impuesto sobre la Renta entre Taiwán y Corea, que como se ha indicado solo se aplica a los supuestos de hecho vinculados con Corea que reúnen sus requisitos y no a cualquier inversor extranjero, se firmó el 17 de noviembre de 2021"),
    ("El tipo del acuerdo no se aplica de forma automática por el mero hecho de que el perceptor se encuentre en Corea.",
     "El tipo del acuerdo no se aplica de forma automática por el mero hecho de que el perceptor se encuentre en Corea; si el país de origen del inversor es otro, debe comprobarse por separado si existe un acuerdo fiscal con Taiwán y cuáles son sus términos."),
])
print("001/004 DONE")
