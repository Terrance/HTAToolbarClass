var toolbar =
{
	init: function(intWidth, intHeight, arMenus, arStatus, intErrors)
	{
		toolbar =
		{
			error:
			{
				on: intErrors,
				warn: function(strSubject, strMessage)
				{
					if (toolbar.error.on)
					{
						alert("HTA Toolbar Class > Error (" + strSubject + ")...\n" + strMessage);
					}
				}
			},
			menu:
			{
				use: false,
				current: null,
				content: null,
				open: false,
				showing: false,
				generate: function(gmDivName, gmTitle, gmItems)
				{
					if (typeof(gmItems) === "object")
					{
						document.getElementById("menu_bar").innerHTML += "<span class=\"menu_root\" hidefocus=\"true\" onclick=\"toolbar.menu.popup('" + gmDivName + "', this);\" ondragstart=\"return false;\" onmouseout=\"if (!toolbar.menu.showing) { this.className = 'menu_root'; }\" onmouseover=\"this.className = 'menu_root_hover'; toolbar.menu.swap('" + gmDivName + "', this);\">" + gmTitle + "</span>" + "<div id=\"" + gmDivName + "\"></div>";
						gmDivName = document.getElementById(gmDivName);
						gmDivName.style.display = "none";
						gmDivName.className = "menu_popup";
						for (var x in gmItems)
						{
							if (gmItems[x] === "-")
							{
								gmDivName.innerHTML += "<span class=\"menu_sep\" hidefocus=\"true\" ondragstart=\"return false;\">&nbsp;</span>";
							}
							else if (typeof(gmItems[x][1]) === "string")
							{
								gmDivName.innerHTML += "<span class=\"menu_item\" hidefocus=\"true\" onclick=\"toolbar.menu.showing = true; toolbar.menu.close(); " + gmItems[x][1] + " \" ondragstart=\"return false;\" onmouseout=\"this.className = 'menu_item'; toolbar.menu.showing = true;\" onmouseover=\"this.className = 'menu_item_hover'; toolbar.menu.showing = false;\">" + gmItems[x][0] + "</span>";
							}
							else
							{
								gmDivName.innerHTML += "<span class=\"menu_item_disabled\" hidefocus=\"true\" ondragstart=\"return false;\">" + gmItems[x][0] + "</span>";
							}
						}
					}
					else if (typeof(gmItems) === "string")
					{
						document.getElementById("menu_bar").innerHTML += "<span class=\"menu_root\" hidefocus=\"true\" onclick=\"this.className = 'menu_root'; " + gmItems + "\" ondragstart=\"return false;\" onmousedown=\"this.className = 'menu_root_selected';\" onmouseout=\"this.className = 'menu_root';\" onmouseover=\"this.className = 'menu_root_hover'; if (toolbar.menu.showing) { toolbar.menu.current.className = 'menu_root'; toolbar.menu.content.style.display = 'none'; }\" onmouseup=\"this.className = 'menu_root';\">" + gmTitle + "</span>" + "<span class=\"menu_root_space\"></span>";
					}
					else
					{
						toolbar.error.warn("Initialization", "Menu button script is invalid.");
					}
				},
				popup: function(mpObject, mpMenu)
				{
					mpObject = document.getElementById(mpObject);
					mpObject.style.top = mpMenu.offsetHeight + mpMenu.offsetTop + 1;
					mpObject.style.left = mpMenu.offsetLeft;
					mpObject.style.display = "";
					mpMenu.className = "menu_root_selected";
					toolbar.menu.current = mpMenu;
					toolbar.menu.content = mpObject;
					toolbar.menu.showing = true;
					toolbar.menu.open = true;
				},
				swap: function(mpObject, mpMenu)
				{
					if (toolbar.menu.showing && toolbar.menu.open)
					{
						toolbar.menu.close();
						toolbar.menu.popup(mpObject, mpMenu);
					}
				},
				close: function()
				{
					if (toolbar.menu.showing)
					{
						toolbar.menu.current.className = "menu_root";
						toolbar.menu.content.style.display = "none";
						toolbar.menu.showing = false;
						toolbar.menu.open = false;
					}
				},
				hide: function()
				{
					if (toolbar.menu.use)
					{
						toolbar.menu.close();
						document.getElementById("menu_bar").style.display = "none";
						toolbar.menu.use = false;
						window.onresize();
					}
					else
					{
						toolbar.error.warn("Menu / Hide", "Menu bar doesn't exist.");
					}
				},
				show: function()
				{
					var menuBar = document.getElementById("menu_bar");
					if (menuBar)
					{
						menuBar.style.display = "block";
						toolbar.menu.use = true;
					}
					else
					{
						toolbar.error.warn("Menu / Show", "Menu bar doesn't exist.");
					}
				}
			},
			status:
			{
				use: false,
				update: function(strText, strIcon, intExpire, strCallback)
				{
					if (toolbar.status.use)
					{
						if (intExpire)
						{
							var oldText = document.getElementById("status_bar").innerHTML;
							setTimeout("toolbar.status.update(\"" + oldText.replace(/\"/g, "\\\"") + "\"); " + strCallback, intExpire);
						}
						var iconCode = "";
						if (strIcon)
						{
							iconCode = "<img class=\"status_icon\" src=\"" + strIcon + "\" />";
						}
						document.getElementById("status_bar").innerHTML = iconCode + strText;
					}
				},
				hide: function()
				{
					if (toolbar.status.use)
					{
						document.getElementById("status_bar").style.display = "none";
						toolbar.status.use = false;
						window.onresize();
					}
					else
					{
						toolbar.error.warn("Status / Hide", "Status bar doesn't exist.");
					}
				},
				show: function()
				{
					var statusBar = document.getElementById("status_bar");
					if (statusBar)
					{
						statusBar.style.display = "block";
						toolbar.status.use = true;
						window.onresize();
					}
					else
					{
						toolbar.error.warn("Status / Show", "Status bar doesn't exist.");
					}
				}
			}
		}
		document.body.onselectstart = function()
		{
			return false;
		}
		if (typeof(intWidth) === "number" && typeof(intHeight) === "number")
		{
			resizeTo(intWidth, intHeight);
			newLeft = (screen.width / 2) - (document.body.clientWidth / 2);
			newTop = (screen.height / 2) - (document.body.clientHeight / 2);
			window.moveTo(newLeft, newTop);
		}
		else
		{
			toolbar.error.warn("Initialization", "Width or height is not a valid number.");
		}
		if (arMenus)
		{
			if (typeof(arMenus) === "object")
			{
				toolbar.menu.use = true;
				document.onmousedown = toolbar.menu.close;
				document.body.innerHTML = "<div id=\"menu_bar\"></div>" + document.body.innerHTML;
				for (var X in arMenus)
				{
					toolbar.menu.generate(arMenus[X][0], arMenus[X][1], arMenus[X][2]);
				}
			}
			else
			{
				toolbar.error.warn("Initialization", "Menu array is invalid.");
			}
		}
		if (arStatus)
		{
			toolbar.status.use = true;
			var strText = arStatus;
			var strIcon;
			if (typeof(strText) === "object")
			{
				strIcon = strText[1];
				strText = strText[0];
			}
			document.body.innerHTML = "<div id=\"status_bar\"></div>" + document.body.innerHTML;
			toolbar.status.update(strText, strIcon);
		}
		window.onresize = function()
		{
			var contentStyle = document.getElementById("content").style;
			contentStyle.height = document.body.clientHeight;
			if (toolbar.menu.use)
			{
				var menuOffset = document.getElementById("menu_bar").offsetHeight;
				contentStyle.top = menuOffset;
				contentStyle.height = (document.body.clientHeight + 36) - (menuOffset + 28);
			}
			if (toolbar.status.use)
			{
				var statusOffset = document.getElementById("status_bar").offsetHeight;
				contentStyle.height = contentStyle.height.substr(0, contentStyle.height.length - 2) - statusOffset;
			}
		}
		window.onresize();
	}
}