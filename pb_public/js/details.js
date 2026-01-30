// Minimal JS helpers for the details card
document.addEventListener('DOMContentLoaded', function () {
  // enable tooltip support if used
  if (window.bootstrap && window.bootstrap.Tooltip) {
    var t = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    t.forEach(function (el) { new bootstrap.Tooltip(el) })
  }
});


// small HTML escaper for inserting user strings into the DOM
function escapeHtml(str) {
  if (typeof str !== 'string') return '' + (str || '');
  return str.replace(/[&<>"]|'/g, function (m) {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return m;
    }
  });
}

// Quill init when modal opens and create handler
var quill = null;
document.addEventListener('shown.bs.modal', function (e) {
  if (!(e.target && e.target.id === 'newAssignmentModal')) return;
  if (window.Quill) {
    if (!quill) {
      quill = new Quill('#assignment_editor', { theme: 'snow' });
      // ensure editor receives focus so paste goes into it
      setTimeout(function () { try { quill.focus(); } catch (e) {} }, 50);
      // increase editor height by 100px (only once)
      try {
        const editorRoot = quill.root; // .ql-editor
        const currentH = editorRoot.clientHeight || editorRoot.scrollHeight || 200;
        editorRoot.style.minHeight = (currentH + 100) + 'px';
        editorRoot.dataset.heightIncreased = '1';
      } catch (e) { /* ignore */ }
    } else {
      try { quill.focus(); } catch (e) {}
      // on subsequent opens, ensure minHeight present
      try {
        const editorRoot = quill.root;
        if (!editorRoot.dataset.heightIncreased) {
          const currentH = editorRoot.clientHeight || editorRoot.scrollHeight || 200;
          editorRoot.style.minHeight = (currentH + 100) + 'px';
          editorRoot.dataset.heightIncreased = '1';
        }
      } catch(e){}
    }
  }
});

async function handleCreateAssignment() {
  try {
    const title = document.getElementById('assignment_title').value || '';
    const classroomId = document.getElementById('assignment_classroom_id').value || document.getElementById('classroom_id')?.value || '';
    const body = quill ? quill.root.innerHTML : document.getElementById('assignment_editor')?.innerHTML || '';
    const fileInput = document.getElementById('assignment_attachment');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('assignment_body', body);
    formData.append('classroom', classroomId);

    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      formData.append('attachment', fileInput.files[0]);
    }

    if (typeof pb !== 'undefined' && pb.collection) {
      const res = await pb.collection('assignment').create(formData);
      console.log('Assignment created', res);
      // Update the DOM in-place (no full reload)
      try {
        const list = document.getElementById('assignmentList');
        const previewsCol = document.querySelectorAll('.col-md-8')[0];
        const nextIndex = list ? list.querySelectorAll('.list-group-item').length : 0;

        // created display
        const createdStr = (res && res.created) ? res.created : (new Date()).toISOString();

        if (list) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'list-group-item list-group-item-action';
          btn.innerHTML = `<strong>${escapeHtml(title)}</strong><br><small>${escapeHtml(createdStr)}</small>`;
          btn.addEventListener('click', function () { showAssignment(nextIndex); });
          // insert at top visually while keeping the internal index mapping
          list.insertBefore(btn, list.firstChild);
          // temporary highlight
          btn.classList.add('list-group-item-success');
          setTimeout(() => { btn.classList.remove('list-group-item-success'); }, 3000);
          // ensure it's visible
          try { btn.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
        }

        if (previewsCol) {
          const preview = document.createElement('div');
          preview.id = `assignment-preview-${nextIndex}`;
          preview.className = 'd-none';
          const attachmentHtml = (fileInput && fileInput.files && fileInput.files.length > 0) ?
            `<hr><strong>Attachment</strong><br><a href="/api/files/assignments/${res.id}/${encodeURIComponent(fileInput.files[0].name)}" target="_blank">📎 ${escapeHtml(fileInput.files[0].name)}</a>` : '';
          preview.innerHTML = `
            <div class="card shadow-sm">
              <div class="card-body">
                <h5>${escapeHtml(title)}</h5>
                <small class="text-muted">${escapeHtml(createdStr)}</small>
                <hr>
                ${body}
                ${attachmentHtml}
              </div>
            </div>
          `;
          // insert preview at top so it appears immediately
          previewsCol.insertBefore(preview, previewsCol.firstChild);
        }

        // hide modal
        var modalEl = document.getElementById('newAssignmentModal');
        var modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();

        // show the newly added assignment if showAssignment exists, else toggle manually
        if (typeof showAssignment === 'function') {
          showAssignment(nextIndex);
        } else {
          // remove active from list items
          if (list) {
            list.querySelectorAll('.list-group-item').forEach((el, i) => el.classList.toggle('active', i === nextIndex));
          }
          // hide other previews and show new preview
          document.querySelectorAll('[id^="assignment-preview-"]').forEach(el => el.classList.add('d-none'));
          const newPreview = document.getElementById(`assignment-preview-${nextIndex}`);
          if (newPreview) newPreview.classList.remove('d-none');
        }

      } catch (domErr) {
        console.error('DOM update after create failed', domErr);
        // fallback: reload
        window.location.reload();
      }
    } else {
      alert('PocketBase client not available.');
    }
  } catch (err) {
    console.error('createAssignment error', err);
    alert('Failed to create assignment. See console.');
  }
}

// Attach both direct and delegated listeners so the button works when inserted dynamically
const directBtn = document.getElementById('createAssignmentBtn');
if (directBtn) directBtn.addEventListener('click', handleCreateAssignment);
document.addEventListener('click', function (e) {
  const t = e.target;
  if (!t) return;
  if (t.id === 'createAssignmentBtn' || t.closest && t.closest('#createAssignmentBtn')) {
    e.preventDefault();
    handleCreateAssignment();
  }
});

function enableDetailsEdit(collection) {
  if(collection === 'student|teacher') {  

      // student-only parent editing
    const p1Select = document.getElementById("parentSelect1Detail");
    const p2Select = document.getElementById("parentSelect2Detail");

    if (!p1Select || !p2Select) return;

    document.getElementById("parent1_display")?.classList.add("d-none");
    document.getElementById("parent2_display")?.classList.add("d-none");

    p1Select.classList.remove("d-none");
    p2Select.classList.remove("d-none");

    loadParentOptions();
  } else if (collection === 'classroom') {
    console.log('Enabling classroom edit');

    const teacherSelect = document.getElementById("classroomTeacherSelectDetail");
    const teacherDisplay = document.getElementById("classroom_teacher_display");

    if (!teacherSelect || !teacherDisplay) return;

    teacherDisplay.classList.add("d-none");
    teacherSelect.classList.remove("d-none");

      loadClassroomOptions();
  }
}

async function loadParentOptions() {
    const p1Select = document.getElementById("parentSelect1Detail");
    const p2Select = document.getElementById("parentSelect2Detail");

    if (!p1Select || !p2Select) return;

    const currentP1 = document.getElementById("parent1_id")?.value;
    const currentP2 = document.getElementById("parent2_id")?.value;

    // reset (keep "Unassigned")
    p1Select.length = 1;
    p2Select.length = 1;

    const parents = await pb.collection("customer").getFullList({
        sort: "last_name"
    });

    parents.forEach(p => {
        const label = `${p.first_name} ${p.last_name}`;

        p1Select.add(new Option(label, p.id, false, p.id === currentP1));
        p2Select.add(new Option(label, p.id, false, p.id === currentP2));
    });
}

async function loadClassroomOptions() {
    const teacherSelect = document.getElementById("classroomTeacherSelectDetail");
    if (!teacherSelect) return;

    const currentTeacherId = document.getElementById("assigned_teacher_id")?.value;

    // reset (keep "Unassigned")
    teacherSelect.length = 1;

    const teachers = await pb.collection("teacher").getFullList({
        sort: "last_name"
    });

    teachers.forEach(t => {
        const label = `${t.first_name} ${t.last_name}`;

        teacherSelect.add(new Option(label, t.id, false, t.id === currentTeacherId));
    });
}

function disableDetailsEdit() {
  console.log('Disabling details edit');
  document.getElementById('submitEditbtn')?.setAttribute('disabled', 'disabled');
  document.getAnimations("submitClassroomBtn")?.setAttribute('disabled', 'disabled');
    // student/teacher parent editing
    const p1Select = document.getElementById("parentSelect1Detail");
    const p2Select = document.getElementById("parentSelect2Detail");

    if (p1Select && p2Select) {
        document.getElementById("parent1_display")?.classList.remove("d-none");
        document.getElementById("parent2_display")?.classList.remove("d-none");

        p1Select.classList.add("d-none");
        p2Select.classList.add("d-none");
    }

    // classroom editing
    const classroomSelect = document.getElementById("classroomSelectDetail");
    const classroomDisplay = document.getElementById("classroom_display");

    if (classroomSelect && classroomDisplay) {
        classroomDisplay.classList.remove("d-none");
        classroomSelect.classList.add("d-none");
    }
}