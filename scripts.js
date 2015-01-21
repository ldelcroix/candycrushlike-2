// JavaScript Document

function CreateGrille(grille, dimensionGrille, Cases)
{	
	if(dimensionGrille >= 3)
	{
		var i, j, type_case, dimMax = dimensionGrille*dimensionGrille;
	
		DeleteGrille(grille);
		
		printf("Creation de la grille");
		
		grille.css("width",32*dimensionGrille);
		grille.css("margin-left",-16*dimensionGrille);
		grille.css("height",32*dimensionGrille);
		
		for(i = 0; i < dimensionGrille; i++)
		{
			for(j = 0; j < dimensionGrille; j++)
			{
				type_case = Math.floor(Math.random()*Cases.length);
				grille.append("<span type=\"normal\" class=\""+Cases[type_case]+"\" style=\"top:"+(i*32)+"px;left:"+(j*32)+"px;\"><canvas></canvas></span>");
			}
		}
		
		grille.queue(function () {
			ActualiseGrille(grille, dimensionGrille);		
			CompleteGrille(grille, dimensionGrille, Cases);
			$(this).dequeue();
		});
		
		grille.children("span[type!=normal]").attr("type","normal");
		$("#score").empty();
		$("#score").append(0);
	}
}

function DeleteGrille(grille)
{
	printf("-------------------------------------------------------");
	printf("Suppression de la grille");
	grille.empty();
}

function CompleteGrille(grille, dimensionGrille, Cases)
{
	printf("On complete les blancs dans la grille");
	var i, onContinue = true, type_case;

	while(onContinue)
	{
		onContinue = false;
		for(i = dimensionGrille*dimensionGrille - 1; i >= 0; i--)
		//for(i = 0; i < dimensionGrille*dimensionGrille; i++)
		{					
			if((grille.children("span:eq("+(i)+")").attr('class') == '') && (i >= dimensionGrille) && (grille.children("span:eq("+(i-dimensionGrille)+")").attr('class') != ''))
			{
				IntervertirDeuxCases(grille.children("span:eq("+(i)+")"), grille.children("span:eq("+(i-dimensionGrille)+")"));
				EffaceAlignement(grille, dimensionGrille, grille.children("span:eq("+(i)+")"));
				onContinue = true;
			}
			else if((grille.children("span:eq("+(i)+")").attr('class') == '') && (i < dimensionGrille))
			{
				type_case = Math.floor(Math.random()*Cases.length);
				grille.children("span:eq("+(i)+")").addClass(Cases[type_case]);
				EffaceAlignement(grille, dimensionGrille, grille.children("span:eq("+(i)+")"));
				onContinue = true;
			}
		}
	}
	
	if(!SolutionnableGrille(grille, dimensionGrille))
	{		
		printf("Aucune solution trouvee");
		/*if(confirm("pas de solution trouvee !\nOn recharge la page ?"))
		{
			location.reload();
		}*/
		alert("Fin de la partie.\nScore : "+$("#score").html());
		location.reload();
		//CreateGrille(grille, dimensionGrille, Cases);		
	}
}

function ActualiseGrille(grille, dimensionGrille)
{
	printf("On efface les alignements dans la grille");
	var i;
	for(i = dimensionGrille*dimensionGrille - 1; i >= 0; i--)
	{
		EffaceAlignement(grille, dimensionGrille, grille.children("span:eq("+(i)+")"));
	}
}

function Combinaison(maCase)
{
	return new Array();
}

function Clignotement(element)
{
	element.fadeOut(25, function(){element.fadeIn(25, function(){element.fadeOut(25, function(){element.fadeIn(25, function(){element.fadeOut(25, function(){element.fadeIn(25);});});});});});
}

function IntervertirDeuxCases(case1, case2, withEffect)
{	
	if((case1 == null) || (case2 == null))
	{
		// ERREUR
	}
	else
	{
		var rememberClass1 = case1.attr("class"), rememberClass2 = case2.attr("class");
		var rememberType1 = case1.attr("type"), rememberType2 = case2.attr("type");
		
		if(withEffect)
		{
			printf("On intervertit "+CasePrint(case2)+" et "+CasePrint(case1));
			
			case1.removeClass(rememberClass1);case1.addClass(rememberClass2);
			case2.removeClass(rememberClass2);case2.addClass(rememberClass1);
			
			case1.attr("type", rememberType2);
			case2.attr("type", rememberType1);
			/*
			case1.fadeOut("fast",function(){$(this).removeClass(rememberClass1);$(this).addClass(rememberClass2);$(this).fadeIn("fast");});
			case2.fadeOut("fast",function(){$(this).removeClass(rememberClass2);$(this).addClass(rememberClass1);$(this).fadeIn("fast");});
			*/
		}
		else
		{
			case1.removeClass(rememberClass1);case1.addClass(rememberClass2);
			case2.removeClass(rememberClass2);case2.addClass(rememberClass1);
			
			case1.attr("type", rememberType2);
			case2.attr("type", rememberType1);
		}
	}
}

function SolutionnableGrille(grille, dim)
{
	printf("On test si il reste une solution dans la grille");
	var i, dimMax, resultat;
	resultat = false;
	dimMax = (dim*dim);
	
	for(i = 0; (i < dimMax) && (resultat == false); i++)
	{
		if(
			TestSiAlignementPossible(grille, dim, grille.children("span:eq("+(i)+")"), 'left')
		||TestSiAlignementPossible(grille, dim, grille.children("span:eq("+(i)+")"), 'right')
		||TestSiAlignementPossible(grille, dim, grille.children("span:eq("+(i)+")"), 'up')
		||TestSiAlignementPossible(grille, dim, grille.children("span:eq("+(i)+")"), 'down')
		)
		{
			resultat = true;
		}
	}
	
	return resultat;	
}

function TestSiMouvementPossible(grille, dim, maCase, directionATester)
{
	var indexCase = maCase.index();
	
	switch(directionATester)
	{
		case 'left' :
			if(indexCase % dim == 0)
			{
				return false;
			}
			else
			{
				return true;
			}
			break;
			
		case 'right' :
			if(indexCase % dim == dim-1)
			{
				return false;
			}
			else
			{
				return true;
			}
			break;
			
		case 'up' :
			if(0 <= indexCase && indexCase < dim)
			{
				return false;
			}
			else
			{
				return true;
			}
			break;
			
		case 'down' :
			if(dim*(dim-1) <= indexCase && indexCase < dim*dim)
			{
				return false;
			}
			else
			{
				return true;
			}
			break;
			
		default :
			return false;
			break;
	}
}

function TestSiAlignementPossible(grille, dim, maCase, directionATester)
{
	var indexCase = maCase.index(), classeCase = maCase.attr('class');
	var left = false, right = false, up = false, down = false;
	
	if(classeCase != '' && TestSiMouvementPossible(grille, dim, maCase, directionATester))
	{
		switch(directionATester)
		{
			case 'left' :
				indexCase--; 
				break;
				
			case 'right' :
				indexCase++; 
				break;
				
			case 'up' :
				indexCase-=dim;
				break;
				
			case 'down' :
				indexCase+=dim;
				break;
				
			default :
				return false;
				break;
		}
		
		if(grille.children("span:eq("+(indexCase)+")").attr('class') != '')
		{		
			IntervertirDeuxCases(maCase, grille.children("span:eq("+(indexCase)+")"), false);
			
			if(grille.children("span:eq("+(indexCase-1)+")").attr('class') == classeCase && grille.children("span:eq("+(indexCase-1)+")").index() % dim != dim -1)
			{
				left = true;
			}
			if(grille.children("span:eq("+(indexCase+1)+")").attr('class') == classeCase && grille.children("span:eq("+(indexCase+1)+")").index() % dim != 0)
			{
				right = true;
			}
			if(grille.children("span:eq("+(indexCase-dim)+")").attr('class') == classeCase)
			{
				up = true;
			}
			if(grille.children("span:eq("+(indexCase+dim)+")").attr('class') == classeCase)
			{
				down = true;
			}
			
			if((left && right) || (up && down))
			{
				IntervertirDeuxCases(maCase, grille.children("span:eq("+(indexCase)+")"), false);
				return true;
			}
			else if(left || right || up || down)
			{
				if(
					((left) && (grille.children("span:eq("+(indexCase-2)+")").attr('class') == classeCase) && grille.children("span:eq("+(indexCase-2)+")").index() % dim != dim -1)
				||((right) && (grille.children("span:eq("+(indexCase+2)+")").attr('class') == classeCase) && grille.children("span:eq("+(indexCase+2)+")").index() % dim != 0)
				||((up) && (grille.children("span:eq("+(indexCase-(2*dim))+")").attr('class') == classeCase))
				||((down) && (grille.children("span:eq("+(indexCase+(2*dim))+")").attr('class') == classeCase))
				)
				{
					IntervertirDeuxCases(maCase, grille.children("span:eq("+(indexCase)+")"), false);
					return true;
				}
			}
			
			IntervertirDeuxCases(maCase, grille.children("span:eq("+(indexCase)+")"), false);
			return false;
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
}

function EffaceAlignement (grille, dim, maCase)
{
	var indexCase = maCase.index(), classeCase = maCase.attr('class'), i, j, compteur, dimMax = dim*dim;
	var left = false, right = false, up = false, down = false;
	
	if(classeCase != '')
	{
		if(grille.children("span:eq("+(indexCase-1)+")").attr('class') == classeCase)
		{
			left = true;
		}
		if(grille.children("span:eq("+(indexCase+1)+")").attr('class') == classeCase)
		{
			right = true;
		}
		if(grille.children("span:eq("+(indexCase-dim)+")").attr('class') == classeCase)
		{
			up = true;
		}
		if(grille.children("span:eq("+(indexCase+dim)+")").attr('class') == classeCase)
		{
			down = true;
		}
		
		if(
			(left && right)
		||((left) && (grille.children("span:eq("+(indexCase-2)+")").attr('class') == classeCase) && grille.children("span:eq("+(indexCase-2)+")").index() % dim != dim -1)
		||((right) && (grille.children("span:eq("+(indexCase+2)+")").attr('class') == classeCase) && grille.children("span:eq("+(indexCase+2)+")").index() % dim != 0)
		)
		{
			compteur = 0;			
			i = 1;
			while(grille.children("span:eq("+(indexCase-i)+")").attr('class') == classeCase && grille.children("span:eq("+(indexCase-i)+")").index() % dim != dim -1)
			{
				if(grille.children("span:eq("+(indexCase-i)+")").attr('type') == 'hyper')
				{
					printf("Hyper combo sur "+classeCase);
					grille.children("span[class="+classeCase+"]").each(function(){
						DeleteCase($(this));
					});
				}
				else if(grille.children("span:eq("+(indexCase-i)+")").attr('type') == 'maxi')
				{
					printf("Maxi combo horizontal sur ligne "+((indexCase - (indexCase % dim))/dim));
					for(j = indexCase - (indexCase % dim); j < indexCase - (indexCase % dim) + dim; j++)
					{
						DeleteCase(grille.children("span:eq("+j+")"));
					}
				}
				
				DeleteCase(grille.children("span:eq("+(indexCase-i)+")"));
				i++;
				compteur++;
			}
			i = 1;
			while(grille.children("span:eq("+(indexCase+i)+")").attr('class') == classeCase && grille.children("span:eq("+(indexCase+i)+")").index() % dim != 0)
			{
				if(grille.children("span:eq("+(indexCase+i)+")").attr('type') == 'hyper')
				{
					printf("Hyper combo sur "+classeCase);
					grille.children("span[class="+classeCase+"]").each(function(){
						DeleteCase($(this));
					});
				}
				else if(grille.children("span:eq("+(indexCase+i)+")").attr('type') == 'maxi')
				{
					printf("Maxi combo horizontal sur ligne "+((indexCase - (indexCase % dim))/dim));
					for(j = indexCase - (indexCase % dim); j < indexCase - (indexCase % dim) + dim; j++)
					{
						DeleteCase(grille.children("span:eq("+j+")"));
					}
				}
				
				DeleteCase(grille.children("span:eq("+(indexCase+i)+")"));
				i++;
				compteur++;
			}
			compteur++;
			
			if(maCase.attr('type') == 'hyper')
			{
				printf("Hyper combo sur "+classeCase);
				grille.children("span[class="+classeCase+"]").each(function(){
					DeleteCase($(this));
				});
			}
			else if(maCase.attr('type') == 'maxi')
			{
				printf("Maxi combo horizontal sur ligne "+((indexCase - (indexCase % dim))/dim));
				for(j = indexCase - (indexCase % dim); j < indexCase - (indexCase % dim) + dim; j++)
				{
					DeleteCase(grille.children("span:eq("+j+")"));
				}
			}
			else
			{			
				if(compteur >= 5)
				{
					printf("Hyper alignement !");
					maCase.attr("type","hyper");
				}
				else if(compteur >= 4)
				{
					printf("Maxi alignement !");
					maCase.attr("type","maxi");
				}
				else
				{
					DeleteCase(maCase);
				}
			}
		}
		else if(
			(up && down)
		||((up) && (grille.children("span:eq("+(indexCase-(2*dim))+")").attr('class') == classeCase))
		||((down) && (grille.children("span:eq("+(indexCase+(2*dim))+")").attr('class') == classeCase))
		)
		{			
			compteur = 0;	
			i = 1;
			while(grille.children("span:eq("+(indexCase-(i*dim))+")").attr('class') == classeCase)
			{
				if(grille.children("span:eq("+(indexCase-(i*dim))+")").attr('type') == 'hyper')
				{
					printf("Hyper combo sur "+classeCase);
					grille.children("span[class="+classeCase+"]").each(function(){
						DeleteCase($(this));
					});
				}
				else if(grille.children("span:eq("+(indexCase-(i*dim))+")").attr('type') == 'maxi')
				{
					printf("Maxi combo vertical sur colonne "+(indexCase % dim));
					for(j = indexCase % dim; j < dimMax; j+=dim)
					{
						DeleteCase(grille.children("span:eq("+j+")"));
					}
				}
				
				DeleteCase(grille.children("span:eq("+(indexCase-(i*dim))+")"));
				i++;
				compteur++;
			}
			i = 1;
			while(grille.children("span:eq("+(indexCase+(i*dim))+")").attr('class') == classeCase)
			{
				if(grille.children("span:eq("+(indexCase+(i*dim))+")").attr('type') == 'hyper')
				{
					printf("Hyper combo sur "+classeCase);
					grille.children("span[class="+classeCase+"]").each(function(){
						DeleteCase($(this));
					});
				}
				else if(grille.children("span:eq("+(indexCase+(i*dim))+")").attr('type') == 'maxi')
				{
					printf("Maxi combo vertical sur colonne "+(indexCase % dim));
					for(j = indexCase % dim; j < dimMax; j+=dim)
					{
						DeleteCase(grille.children("span:eq("+j+")"));
					}
				}
				
				DeleteCase(grille.children("span:eq("+(indexCase+(i*dim))+")"));
				i++;
				compteur++;
			}
			compteur++;
			
			if(maCase.attr('type') == 'hyper')
			{
				printf("Hyper combo sur "+classeCase);
				grille.children("span[class="+classeCase+"]").each(function(){
					DeleteCase($(this));
				});
			}
			else if(maCase.attr('type') == 'maxi')
			{
				printf("Maxi combo vertical sur colonne "+(indexCase % dim));
				for(j = indexCase % dim; j < dimMax; j+=dim)
				{
					DeleteCase(grille.children("span:eq("+j+")"));
				}
			}
			else
			{			
				if(compteur >= 5)
				{
					printf("Hyper alignement !");
					maCase.attr("type","hyper");
				}
				else if(compteur >= 4)
				{
					printf("Maxi alignement !");
					maCase.attr("type","maxi");
				}
				else
				{
					DeleteCase(maCase);
				}
			}
		}
	}
}

function printf(string)
{
	// Déclaration et initialisation d'une variable statique
	if ( typeof this.counter == 'undefined' ) this.counter = 0;

	// Incrémentation de sa valeur
	this.counter++;
		
	$("#console").append((this.counter)+'. '+string+"<br>");
}

function CasePrint(maCase)
{
	if(maCase.index() == null)
	{return "{[?] : ?}";}
	else
	{return "{["+maCase.index()+"] : "+maCase.attr('class')+"}";}
}

function DeleteCase(maCase)
{
	var score = $("#score").html();	
	score++;
	$("#score").empty();
	$("#score").append(score);
	
	//maCase.fadeOut("slow");
	maCase.removeClass();
	maCase.attr("type","normal");
}