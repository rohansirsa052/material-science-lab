const modalStyle =
  ".modal-wrapper{position:absolute;z-index:999;top:0;width:100%;height:100%;background-color:rgba(0,0,0,.5)}.modal{margin:20px auto;background-color:#fff;max-width:600px;border-radius:5px}.modal .modal-head{background-color:rgba(0,0,0,.05);padding:12px;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom:1px solid}.modal .modal-body{padding:12px 14px}.modal .modal_close{float:right;padding:5px;margin:5px;width:20px;height:20px;text-align:center;font-size:20px;font-weight:700;color:#000;text-decoration:none;cursor:pointer;border-radius:50px}.modal .modal_close:hover{background-color:rgb(0,0,0,.1)}.modal .modal-body p{font-size: 14px;}.modal .btn{color:#515151;background-color:#f2f2f2;padding:6px 8px;border-radius:4px;box-shadow:1px 1px 4px 0px rgba(0,0,0,.20);border:1px solid #bfbfbf}.modal .btn:hover{box-shadow:1px 1px 4px 0px rgba(0,0,0,.30);cursor:pointer;background-color:#efefef;}.model-buttons{display:flex;justify-content:space-between;border-top: 1px solid #bfbfbf;padding-top:10px;margin-top:5px}.pages{display:none;}.pages.active{display:block;}.modal .d-none{display:none;}.lbl-correct{font-weight:600;font-size:16px !important;text-align:center;color:green}.lbl-wrong{font-weight:600;font-size:16px !important;text-align:center;color:red}.modal .m-1{margin:4px}";

class Modal {
  constructor(params) {
    this.questions = [];
    this.title = "";
    this.isVisible = false;
    this.page = 1;
    this.onClose = () => {};

    if (params && params.title) {
      this.title = params.title;
    }
    if (params && params.body) {
      this.questions = params.body;
    }
    if (params && params.onClose) {
      this.onClose = params.onClose;
    }
  }

  show() {
    this.isVisible = true;
    this.render();
  }

  onNext(callback) {
    this.callback = callback;
  }

  render() {
    this.id = "modal_" + Math.random().toString(36).substring(7);

    let html = `
      <div id="${this.id}" style="display: ${this.isVisible ? "block" : "none"}">
        <style>${modalStyle}</style>
        <div class="modal-wrapper">
          <div class="modal">
            <a class="modal_close">&times;</a>
            <div class="modal-head">${this.title}</div>
            <div class="modal-body">
            ${this.questions
              .map(
                (ques) =>
                  `<div id="page${ques.page}" class="pages">
                <p class="m-1">${ques.page}. ${ques.title}</p>
                <p class="m-1">${ques.desc ? `${ques.desc}` : ""}</p>
                <div>
                  ${ques.image ? `<image src="${ques.image}" style="width:90%;" />` : ""}
                </div>

                ${ques.options
                  .map(
                    (opt, index) =>
                      `<p class="m-1">
                        <input type="radio" id="option-${ques.page}-${index}" name="answer-${ques.page}" value="${
                        ques.correct == index ? 1 : 0
                      }">
                        <label for="option-${ques.page}-${index}">${opt}</label>
                      </p>`
                  )
                  .join("")}

                <p class="mb-2 red lbl-wrong" style="display:none">Wrong Ans!</p>
                <p class="mb-2 lbl-correct" style="display:none">Correct Ans!</p>
                <div class="model-buttons">
                  <button class="btn btnCheckAnswer">Check Answer</button>
                  <div>
                    <button class="btn btnPrev">&lt; Prev</button>
                    <button class="btn btnNext">Next &gt;</button>
                  </div>
                </div>
              </div>`
              )
              .join("")}
            </div>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML("beforeend", html);

    document.getElementById("page1").classList.add("active");
    document.getElementById("page1").querySelector(".btnPrev").classList.add("d-none");

    let maxPage = this.questions.length;
    document
      .getElementById("page" + String(maxPage))
      .querySelector(".btnNext")
      .classList.add("d-none");

    document
      .getElementById(this.id)
      .querySelector("a.modal_close")
      .addEventListener("click", () => {
        this.isVisible = false;
        document.getElementById(this.id).remove();
        this.onClose();
      });

    document
      .getElementById(this.id)
      .querySelectorAll(".pages .btnNext")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          this.page++;
          document.getElementById("page" + (this.page - 1)).classList.remove("active");
          document.getElementById("page" + this.page).classList.add("active");
        });
      });

    document
      .getElementById(this.id)
      .querySelectorAll(".pages .btnPrev")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          this.page--;
          document.getElementById("page" + (this.page + 1)).classList.remove("active");
          document.getElementById("page" + this.page).classList.add("active");
        });
      });

    document
      .getElementById(this.id)
      .querySelectorAll(".btnCheckAnswer")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          let p = this.page;
          let selected = document.querySelector(`#page${p} input[name='answer-${p}']:checked`);
          if (selected) {
            if (selected.value == 1) {
              document.querySelector(`#page${p} .lbl-correct`).style.display = "block";
              document.querySelector(`#page${p} .lbl-wrong`).style.display = "none";
            } else {
              document.querySelector(`#page${p} .lbl-correct`).style.display = "none";
              document.querySelector(`#page${p} .lbl-wrong`).style.display = "block";
            }
          }
        });
      });
  }
}